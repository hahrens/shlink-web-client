import {
  faChartPie as pieChartIcon,
  faEdit as editIcon,
  faMinusCircle as deleteIcon,
  faQrcode as qrIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import { DropdownItem } from 'reactstrap';
import type { SelectedServer } from '../../servers/data';
import { useToggle } from '../../utils/helpers/hooks';
import { RowDropdownBtn } from '../../utils/RowDropdownBtn';
import type { ShortUrl, ShortUrlModalProps } from '../data';
import { ShortUrlDetailLink } from './ShortUrlDetailLink';
import { useTranslation } from 'react-i18next';

interface ShortUrlsRowMenuProps {
  selectedServer: SelectedServer;
  shortUrl: ShortUrl;
}
type ShortUrlModal = FC<ShortUrlModalProps>;

export const ShortUrlsRowMenu = (
  DeleteShortUrlModal: ShortUrlModal,
  QrCodeModal: ShortUrlModal,
) => ({ shortUrl, selectedServer }: ShortUrlsRowMenuProps) => {
  const { t } = useTranslation();
  const [isQrModalOpen,, openQrCodeModal, closeQrCodeModal] = useToggle();
  const [isDeleteModalOpen,, openDeleteModal, closeDeleteModal] = useToggle();

  return (
    <RowDropdownBtn minWidth={190}>
      <DropdownItem tag={ShortUrlDetailLink} selectedServer={selectedServer} shortUrl={shortUrl} suffix="visits">
        <FontAwesomeIcon icon={pieChartIcon} fixedWidth /> {t('Visit stats')}
      </DropdownItem>

      <DropdownItem tag={ShortUrlDetailLink} selectedServer={selectedServer} shortUrl={shortUrl} suffix="edit">
        <FontAwesomeIcon icon={editIcon} fixedWidth /> {t('Edit short URL')}
      </DropdownItem>

      <DropdownItem onClick={openQrCodeModal}>
        <FontAwesomeIcon icon={qrIcon} fixedWidth /> {t('QR code')}
      </DropdownItem>
      <QrCodeModal shortUrl={shortUrl} isOpen={isQrModalOpen} toggle={closeQrCodeModal} />

      <DropdownItem divider />

      <DropdownItem className="dropdown-item--danger" onClick={openDeleteModal}>
        <FontAwesomeIcon icon={deleteIcon} fixedWidth /> Delete short URL
      </DropdownItem>
      <DeleteShortUrlModal shortUrl={shortUrl} isOpen={isDeleteModalOpen} toggle={closeDeleteModal} />
    </RowDropdownBtn>
  );
};

export type ShortUrlsRowMenuType = ReturnType<typeof ShortUrlsRowMenu>;
