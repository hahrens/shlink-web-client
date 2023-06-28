import { faClone as copyIcon } from '@fortawesome/free-regular-svg-icons';
import { faTimes as closeIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Tooltip } from 'reactstrap';
import { ShlinkApiError } from '../../api/ShlinkApiError';
import type { TimeoutToggle } from '../../utils/helpers/hooks';
import { Result } from '../../utils/Result';
import type { ShortUrlCreation } from '../reducers/shortUrlCreation';
import { useTranslation } from 'react-i18next';
import './CreateShortUrlResult.scss';

export interface CreateShortUrlResultProps {
  creation: ShortUrlCreation;
  resetCreateShortUrl: () => void;
  canBeClosed?: boolean;
}

export const CreateShortUrlResult = (useTimeoutToggle: TimeoutToggle) => (
  { creation, resetCreateShortUrl, canBeClosed = false }: CreateShortUrlResultProps,
) => {
  const { t } = useTranslation();
  const [showCopyTooltip, setShowCopyTooltip] = useTimeoutToggle();
  const { error, saved } = creation;

  useEffect(() => {
    resetCreateShortUrl();
  }, []);

  if (error) {
    return (
      <Result type="error" className="mt-3">
        {canBeClosed && <FontAwesomeIcon icon={closeIcon} className="float-end pointer" onClick={resetCreateShortUrl} />}
        <ShlinkApiError errorData={creation.errorData} fallbackMessage={t('An error occurred while creating the URL :(')} />
      </Result>
    );
  }

  if (!saved) {
    return null;
  }

  const { shortUrl } = creation.result;

  return (
    <Result type="success" className="mt-3">
      {canBeClosed && <FontAwesomeIcon icon={closeIcon} className="float-end pointer" onClick={resetCreateShortUrl} />}
      <span><b>{t('Great!')}</b> {t('The short URL is')} <b>{shortUrl}</b></span>

      <CopyToClipboard text={shortUrl} onCopy={setShowCopyTooltip}>
        <button
          className="btn btn-light btn-sm create-short-url-result__copy-btn"
          id="copyBtn"
          type="button"
        >
          <FontAwesomeIcon icon={copyIcon} /> {t('Copy')}
        </button>
      </CopyToClipboard>

      <Tooltip placement="left" isOpen={showCopyTooltip} target="copyBtn">
        Copied!
      </Tooltip>
    </Result>
  );
};
