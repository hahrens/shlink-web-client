import type { FC } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Row } from 'reactstrap';
import type { ShlinkShortUrlsListParams } from '../api/types';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import type { Settings } from '../settings/reducers/settings';
import type { CreateShortUrlProps } from '../short-urls/CreateShortUrl';
import type { ShortUrlsList as ShortUrlsListState } from '../short-urls/reducers/shortUrlsList';
import { ITEMS_IN_OVERVIEW_PAGE } from '../short-urls/reducers/shortUrlsList';
import type { ShortUrlsTableType } from '../short-urls/ShortUrlsTable';
import type { TagsList } from '../tags/reducers/tagsList';
import { useFeature } from '../utils/helpers/features';
import { prettify } from '../utils/helpers/numbers';
import type { VisitsOverview } from '../visits/reducers/visitsOverview';
import type { SelectedServer } from './data';
import { getServerId } from './data';
import { HighlightCard } from './helpers/HighlightCard';
import { VisitsHighlightCard } from './helpers/VisitsHighlightCard';
import { useTranslation } from 'react-i18next';

interface OverviewConnectProps {
  shortUrlsList: ShortUrlsListState;
  listShortUrls: (params: ShlinkShortUrlsListParams) => void;
  listTags: Function;
  tagsList: TagsList;
  selectedServer: SelectedServer;
  visitsOverview: VisitsOverview;
  loadVisitsOverview: Function;
  settings: Settings;
}

export const Overview = (
  ShortUrlsTable: ShortUrlsTableType,
  CreateShortUrl: FC<CreateShortUrlProps>,
) => boundToMercureHub(({
  shortUrlsList,
  listShortUrls,
  listTags,
  tagsList,
  selectedServer,
  loadVisitsOverview,
  visitsOverview,
  settings: { visits },
}: OverviewConnectProps) => {
  const { t } = useTranslation();
  const { loading, shortUrls } = shortUrlsList;
  const { loading: loadingTags } = tagsList;
  const { loading: loadingVisits, nonOrphanVisits, orphanVisits } = visitsOverview;
  const serverId = getServerId(selectedServer);
  const linkToNonOrphanVisits = useFeature('nonOrphanVisits', selectedServer);
  const navigate = useNavigate();

  useEffect(() => {
    listShortUrls({ itemsPerPage: ITEMS_IN_OVERVIEW_PAGE, orderBy: { field: 'dateCreated', dir: 'DESC' } });
    listTags();
    loadVisitsOverview();
  }, []);

  return (
    <>
      <Row>
        <div className="col-lg-6 col-xl-3 mb-3">
          <VisitsHighlightCard
            title={t('Visits')}
            link={linkToNonOrphanVisits ? `/server/${serverId}/non-orphan-visits` : undefined}
            excludeBots={visits?.excludeBots ?? false}
            loading={loadingVisits}
            visitsSummary={nonOrphanVisits}
          />
        </div>
        <div className="col-lg-6 col-xl-3 mb-3">
          <VisitsHighlightCard
            title={t('Orphan visits')}
            link={`/server/${serverId}/orphan-visits`}
            excludeBots={visits?.excludeBots ?? false}
            loading={loadingVisits}
            visitsSummary={orphanVisits}
          />
        </div>
        <div className="col-lg-6 col-xl-3 mb-3">
          <HighlightCard title={t('Short URLs')} link={`/server/${serverId}/list-short-urls/1`}>
            {loading ? 'Loading...' : prettify(shortUrls?.pagination.totalItems ?? 0)}
          </HighlightCard>
        </div>
        <div className="col-lg-6 col-xl-3 mb-3">
          <HighlightCard title={t('Tags')} link={`/server/${serverId}/manage-tags`}>
            {loadingTags ? 'Loading...' : prettify(tagsList.tags.length)}
          </HighlightCard>
        </div>
      </Row>

      <Card className="mb-3">
        <CardHeader>
          <span className="d-sm-none">{t('Create a short URL')}</span>
          <h5 className="d-none d-sm-inline">{t('Create a short URL')}</h5>
          <Link className="float-end" to={`/server/${serverId}/create-short-url`}>{t('Advanced options')} &raquo;</Link>
        </CardHeader>
        <CardBody>
          <CreateShortUrl basicMode />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <span className="d-sm-none">{t('Recently created URLs')}</span>
          <h5 className="d-none d-sm-inline">{t('Recently created URLs')}</h5>
          <Link className="float-end" to={`/server/${serverId}/list-short-urls/1`}>{t('See all')} &raquo;</Link>
        </CardHeader>
        <CardBody>
          <ShortUrlsTable
            shortUrlsList={shortUrlsList}
            selectedServer={selectedServer}
            className="mb-0"
            onTagClick={(tag) => navigate(`/server/${serverId}/list-short-urls/1?tags=${encodeURIComponent(tag)}`)}
          />
        </CardBody>
      </Card>
    </>
  );
}, () => [Topics.visits, Topics.orphanVisits]);
