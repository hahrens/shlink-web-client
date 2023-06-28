import classNames from 'classnames';
import { isEmpty } from 'ramda';
import type { ReactNode } from 'react';
import type { SelectedServer } from '../servers/data';
import type { ShortUrlsOrderableFields } from './data';
import type { ShortUrlsRowType } from './helpers/ShortUrlsRow';
import type { ShortUrlsList as ShortUrlsListState } from './reducers/shortUrlsList';
import { useTranslation } from 'react-i18next';
import './ShortUrlsTable.scss';

interface ShortUrlsTableProps {
  orderByColumn?: (column: ShortUrlsOrderableFields) => () => void;
  renderOrderIcon?: (column: ShortUrlsOrderableFields) => ReactNode;
  shortUrlsList: ShortUrlsListState;
  selectedServer: SelectedServer;
  onTagClick?: (tag: string) => void;
  className?: string;
}

export const ShortUrlsTable = (ShortUrlsRow: ShortUrlsRowType) => ({
  orderByColumn,
  renderOrderIcon,
  shortUrlsList,
  onTagClick,
  selectedServer,
  className,
}: ShortUrlsTableProps) => {
  const { t } = useTranslation();
  const { error, loading, shortUrls } = shortUrlsList;
  const actionableFieldClasses = classNames({ 'short-urls-table__header-cell--with-action': !!orderByColumn });
  const orderableColumnsClasses = classNames('short-urls-table__header-cell', actionableFieldClasses);
  const tableClasses = classNames('table table-hover responsive-table short-urls-table', className);

  const renderShortUrls = () => {
    if (error) {
      return (
        <tr>
          <td colSpan={6} className="text-center table-danger text-dark">
            {t('Something went wrong while loading short URLs :(')}
          </td>
        </tr>
      );
    }

    if (loading) {
      return <tr><td colSpan={6} className="text-center">{t('Loading...')}</td></tr>;
    }

    if (!loading && isEmpty(shortUrls?.data)) {
      return <tr><td colSpan={6} className="text-center">{t('No results found')}</td></tr>;
    }

    return shortUrls?.data.map((shortUrl) => (
      <ShortUrlsRow
        key={shortUrl.shortUrl}
        shortUrl={shortUrl}
        selectedServer={selectedServer}
        onTagClick={onTagClick}
      />
    ));
  };

  return (
    <table className={tableClasses}>
      <thead className="responsive-table__header short-urls-table__header">
        <tr>
          <th className={orderableColumnsClasses} onClick={orderByColumn?.('dateCreated')}>
            {t('Created at')} {renderOrderIcon?.('dateCreated')}
          </th>
          <th className={orderableColumnsClasses} onClick={orderByColumn?.('shortCode')}>
            {t('Short URL')} {renderOrderIcon?.('shortCode')}
          </th>
          <th className="short-urls-table__header-cell">
            <span className={actionableFieldClasses} onClick={orderByColumn?.('title')}>
            {t('Title')} {renderOrderIcon?.('title')}
            </span>
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <span className={actionableFieldClasses} onClick={orderByColumn?.('longUrl')}>
              <span className="indivisible">{t('Long URL')}</span> {renderOrderIcon?.('longUrl')}
            </span>
          </th>
          <th className="short-urls-table__header-cell">Tags</th>
          <th className={orderableColumnsClasses} onClick={orderByColumn?.('visits')}>
            <span className="indivisible">{t('Visits')} {renderOrderIcon?.('visits')}</span>
          </th>
          <th className="short-urls-table__header-cell" colSpan={2} />
        </tr>
      </thead>
      <tbody>
        {renderShortUrls()}
      </tbody>
    </table>
  );
};

export type ShortUrlsTableType = ReturnType<typeof ShortUrlsTable>;
