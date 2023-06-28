import { splitEvery } from 'ramda';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SimplePaginator } from '../common/SimplePaginator';
import { useQueryState } from '../utils/helpers/hooks';
import { parseQuery } from '../utils/helpers/query';
import { SimpleCard } from '../utils/SimpleCard';
import { TableOrderIcon } from '../utils/table/TableOrderIcon';
import type { TagsListChildrenProps, TagsOrder, TagsOrderableFields } from './data/TagsListChildrenProps';
import type { TagsTableRowProps } from './TagsTableRow';
import { useTranslation } from 'react-i18next';
import './TagsTable.scss';

export interface TagsTableProps extends TagsListChildrenProps {
  orderByColumn: (field: TagsOrderableFields) => () => void;
  currentOrder: TagsOrder;
}

const TAGS_PER_PAGE = 20; // TODO Allow customizing this value in settings

export const TagsTable = (TagsTableRow: FC<TagsTableRowProps>) => (
  { sortedTags, selectedServer, orderByColumn, currentOrder }: TagsTableProps,
) => {
  const { t } = useTranslation();
  const isFirstLoad = useRef(true);
  const { search } = useLocation();
  const { page: pageFromQuery = 1 } = parseQuery<{ page?: number | string }>(search);
  const [page, setPage] = useQueryState<number>('page', Number(pageFromQuery));
  const pages = splitEvery(TAGS_PER_PAGE, sortedTags);
  const showPaginator = pages.length > 1;
  const currentPage = pages[page - 1] ?? [];

  useEffect(() => {
    !isFirstLoad.current && setPage(1);
    isFirstLoad.current = false;
  }, [sortedTags]);
  useEffect(() => {
    scrollTo(0, 0);
  }, [page]);

  return (
    <SimpleCard key={page} bodyClassName={showPaginator ? 'pb-1' : ''}>
      <table className="table table-hover responsive-table mb-0">
        <thead className="responsive-table__header">
          <tr>
            <th className="tags-table__header-cell" onClick={orderByColumn('tag')}>
              {t('Tag')} <TableOrderIcon currentOrder={currentOrder} field="tag" />
            </th>
            <th className="tags-table__header-cell text-lg-end" onClick={orderByColumn('shortUrls')}>
              {t('Short URLs')} <TableOrderIcon currentOrder={currentOrder} field="shortUrls" />
            </th>
            <th className="tags-table__header-cell text-lg-end" onClick={orderByColumn('visits')}>
              {t('Visits')} <TableOrderIcon currentOrder={currentOrder} field="visits" />
            </th>
            <th aria-label="Options" className="tags-table__header-cell" />
          </tr>
          <tr><th aria-label="Separator" colSpan={4} className="p-0 border-top-0" /></tr>
        </thead>
        <tbody>
          {currentPage.length === 0 && <tr><td colSpan={4} className="text-center">{t('No results found')}</td></tr>}
          {currentPage.map((tag) => <TagsTableRow key={tag.tag} tag={tag} selectedServer={selectedServer} />)}
        </tbody>
      </table>

      {showPaginator && (
        <div className="sticky-card-paginator">
          <SimplePaginator pagesCount={pages.length} currentPage={page} setCurrentPage={setPage} />
        </div>
      )}
    </SimpleCard>
  );
};
