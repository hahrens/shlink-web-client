import type { ChartData, ChartDataset, ChartOptions, InteractionItem } from 'chart.js';
import {
  add,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  differenceInWeeks,
  endOfISOWeek,
  format,
  parseISO,
  startOfISOWeek,
} from 'date-fns';
import { always, cond, countBy, reverse } from 'ramda';
import type { MutableRefObject } from 'react';
import { useMemo, useRef, useState } from 'react';
import { getElementAtEvent, Line } from 'react-chartjs-2';
import {
  Card,
  CardBody,
  CardHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { pointerOnHover, renderChartLabel } from '../../utils/helpers/charts';
import { STANDARD_DATE_FORMAT } from '../../utils/helpers/date';
import { useToggle } from '../../utils/helpers/hooks';
import { prettify } from '../../utils/helpers/numbers';
import { fillTheGaps } from '../../utils/helpers/visits';
import { HIGHLIGHTED_COLOR, MAIN_COLOR } from '../../utils/theme';
import { ToggleSwitch } from '../../utils/ToggleSwitch';
import { rangeOf } from '../../utils/utils';
import type { NormalizedVisit, Stats } from '../types';
import './LineChartCard.scss';

interface LineChartCardProps {
  title: string;
  highlightedLabel?: string;
  visits: NormalizedVisit[];
  highlightedVisits: NormalizedVisit[];
  setSelectedVisits?: (visits: NormalizedVisit[]) => void;
}

type Step = 'monthly' | 'weekly' | 'daily' | 'hourly';

const STEPS_MAP: Record<Step, string> = {
  monthly: 'Month',
  weekly: 'Week',
  daily: 'Day',
  hourly: 'Hour',
};

const STEP_TO_DURATION_MAP: Record<Step, (amount: number) => Duration> = {
  hourly: (hours: number) => ({ hours }),
  daily: (days: number) => ({ days }),
  weekly: (weeks: number) => ({ weeks }),
  monthly: (months: number) => ({ months }),
};

const STEP_TO_DIFF_FUNC_MAP: Record<Step, (dateLeft: Date, dateRight: Date) => number> = {
  hourly: differenceInHours,
  daily: differenceInDays,
  weekly: differenceInWeeks,
  monthly: differenceInMonths,
};

const STEP_TO_DATE_FORMAT: Record<Step, (date: Date) => string> = {
  hourly: (date) => format(date, 'yyyy-MM-dd HH:00'),
  daily: (date) => format(date, STANDARD_DATE_FORMAT),
  weekly(date) {
    const firstWeekDay = format(startOfISOWeek(date), STANDARD_DATE_FORMAT);
    const lastWeekDay = format(endOfISOWeek(date), STANDARD_DATE_FORMAT);

    return `${firstWeekDay} - ${lastWeekDay}`;
  },
  monthly: (date) => format(date, 'yyyy-MM'),
};

const determineInitialStep = (oldestVisitDate: string): Step => {
  const now = new Date();
  const oldestDate = parseISO(oldestVisitDate);
  const matcher = cond<Array<any>, Step | undefined>([
    [() => differenceInDays(now, oldestDate) <= 2, always<Step>('hourly')], // Less than 2 days
    [() => differenceInMonths(now, oldestDate) <= 1, always<Step>('daily')], // Between 2 days and 1 month
    [() => differenceInMonths(now, oldestDate) <= 6, always<Step>('weekly')], // Between 1 and 6 months
  ]);

  return matcher() ?? 'monthly';
};

const groupVisitsByStep = (step: Step, visits: NormalizedVisit[]): Stats => countBy(
  (visit) => STEP_TO_DATE_FORMAT[step](parseISO(visit.date)),
  visits,
);

const visitsToDatasetGroups = (step: Step, visits: NormalizedVisit[]) =>
  visits.reduce<Record<string, NormalizedVisit[]>>(
    (acc, visit) => {
      const key = STEP_TO_DATE_FORMAT[step](parseISO(visit.date));

      acc[key] = acc[key] ?? [];
      acc[key].push(visit);

      return acc;
    },
    {},
  );

const generateLabels = (step: Step, visits: NormalizedVisit[]): string[] => {
  const diffFunc = STEP_TO_DIFF_FUNC_MAP[step];
  const formatter = STEP_TO_DATE_FORMAT[step];
  const newerDate = parseISO(visits[0].date);
  const oldestDate = parseISO(visits[visits.length - 1].date);
  const size = diffFunc(newerDate, oldestDate);
  const duration = STEP_TO_DURATION_MAP[step];

  return [
    formatter(oldestDate),
    ...rangeOf(size, (num) => formatter(add(oldestDate, duration(num)))),
  ];
};

const generateLabelsAndGroupedVisits = (
  visits: NormalizedVisit[],
  groupedVisitsWithGaps: Stats,
  step: Step,
  skipNoElements: boolean,
): [string[], number[]] => {
  if (skipNoElements) {
    return [Object.keys(groupedVisitsWithGaps), Object.values(groupedVisitsWithGaps)];
  }

  const labels = generateLabels(step, visits);

  return [labels, fillTheGaps(groupedVisitsWithGaps, labels)];
};

const generateDataset = (data: number[], label: string, color: string): ChartDataset => ({
  label,
  data,
  fill: false,
  tension: 0.2,
  borderColor: color,
  backgroundColor: color,
});

let selectedLabel: string | null = null;

const chartElementAtEvent = (
  labels: string[],
  datasetsByPoint: Record<string, NormalizedVisit[]>,
  [chart]: InteractionItem[],
  setSelectedVisits?: (visits: NormalizedVisit[]) => void,
) => {
  if (!setSelectedVisits || !chart) {
    return;
  }

  const { index } = chart;

  if (selectedLabel === labels[index]) {
    setSelectedVisits([]);
    selectedLabel = null;
  } else {
    setSelectedVisits(labels[index] && datasetsByPoint[labels[index]] ? datasetsByPoint[labels[index]] : []);
    selectedLabel = labels[index] ?? null;
  }
};

export const LineChartCard = (
  { title, visits, highlightedVisits, highlightedLabel = 'Selected', setSelectedVisits }: LineChartCardProps,
) => {
  const [step, setStep] = useState<Step>(
    visits.length > 0 ? determineInitialStep(visits[visits.length - 1].date) : 'monthly',
  );
  const [skipNoVisits, toggleSkipNoVisits] = useToggle(true);
  const refWithHighlightedVisits = useRef(null);
  const refWithoutHighlightedVisits = useRef(null);

  const datasetsByPoint = useMemo(() => visitsToDatasetGroups(step, visits), [step, visits]);
  const groupedVisitsWithGaps = useMemo(() => groupVisitsByStep(step, reverse(visits)), [step, visits]);
  const [labels, groupedVisits] = useMemo(
    () => generateLabelsAndGroupedVisits(visits, groupedVisitsWithGaps, step, skipNoVisits),
    [visits, step, skipNoVisits],
  );
  const groupedHighlighted = useMemo(
    () => fillTheGaps(groupVisitsByStep(step, reverse(highlightedVisits)), labels),
    [highlightedVisits, step, labels],
  );
  const generateChartDatasets = (): ChartDataset[] => {
    const mainDataset = generateDataset(groupedVisits, 'Visits', MAIN_COLOR);

    if (highlightedVisits.length === 0) {
      return [mainDataset];
    }

    const highlightedDataset = generateDataset(groupedHighlighted, highlightedLabel, HIGHLIGHTED_COLOR);

    return [mainDataset, highlightedDataset];
  };
  const generateChartData = (): ChartData => ({ labels, datasets: generateChartDatasets() });

  const options: ChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        intersect: false,
        axis: 'x',
        callbacks: { label: renderChartLabel },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          callback: prettify,
        },
      },
      x: {
        title: { display: true, text: STEPS_MAP[step] },
      },
    },
    onHover: pointerOnHover,
  };
  const renderLineChart = (theRef: MutableRefObject<any>) => (
    <Line
      ref={theRef}
      data={generateChartData() as any}
      options={options as any}
      onClick={(e) =>
        chartElementAtEvent(labels, datasetsByPoint, getElementAtEvent(theRef.current, e), setSelectedVisits)}
    />
  );

  return (
    <Card>
      <CardHeader role="heading">
        {title}
        <div className="float-end">
          <UncontrolledDropdown>
            <DropdownToggle caret color="link" className="btn-sm p-0">
              Group by
            </DropdownToggle>
            <DropdownMenu end>
              {Object.entries(STEPS_MAP).map(([value, menuText]) => (
                <DropdownItem key={value} active={step === value} onClick={() => setStep(value as Step)}>
                  {menuText}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        <div className="float-end me-2">
          <ToggleSwitch checked={skipNoVisits} onChange={toggleSkipNoVisits}>
            <small>Skip dates with no visits</small>
          </ToggleSwitch>
        </div>
      </CardHeader>
      <CardBody className="line-chart-card__body">
        {/* It's VERY IMPORTANT to render two different components here, as one has 1 dataset and the other has 2 */}
        {/* Using the same component causes a crash when switching from 1 to 2 datasets, and then back to 1 dataset */}
        {highlightedVisits.length > 0 && renderLineChart(refWithHighlightedVisits)}
        {highlightedVisits.length === 0 && renderLineChart(refWithoutHighlightedVisits)}
      </CardBody>
    </Card>
  );
};
