import { faSortAmountDown as sortDescIcon, faSortAmountUp as sortAscIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { toPairs } from 'ramda';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import type { Order, OrderDir } from './helpers/ordering';
import { determineOrderDir } from './helpers/ordering';
import { useTranslation } from 'react-i18next';
import './OrderingDropdown.scss';

export interface OrderingDropdownProps<T extends string = string> {
  items: Record<T, string>;
  order: Order<T>;
  onChange: (orderField?: T, orderDir?: OrderDir) => void;
  isButton?: boolean;
  right?: boolean;
  prefixed?: boolean;
}

export function OrderingDropdown<T extends string = string>(
  { items, order, onChange, isButton = true, right = false, prefixed = true }: OrderingDropdownProps<T>,
) {
  const { t } = useTranslation();
  const handleItemClick = (fieldKey: T) => () => {
    const newOrderDir = determineOrderDir(fieldKey, order.field, order.dir);
    onChange(newOrderDir ? fieldKey : undefined, newOrderDir);
  };

  return (
    <UncontrolledDropdown>
      <DropdownToggle
        caret
        color={isButton ? 'primary' : 'link'}
        className={classNames({
          'dropdown-btn__toggle btn-block pe-4 overflow-hidden': isButton,
          'btn-sm p-0': !isButton,
        })}
      >
        {!isButton && <>{t('Order by')}</>}
        {isButton && !order.field && <i>{t('Order by...')}</i>}
        {isButton && order.field && <>{prefixed && t('Order by: ')}{items[order.field]} - <small>{order.dir ?? 'DESC'}</small></>}
      </DropdownToggle>
      <DropdownMenu
        end={right}
        className={classNames('w-100', { 'ordering-dropdown__menu--link': !isButton })}
      >
        {toPairs(items).map(([fieldKey, fieldValue]) => (
          <DropdownItem key={fieldKey} active={order.field === fieldKey} onClick={handleItemClick(fieldKey as T)}>
            {fieldValue}
            {order.field === fieldKey && (
              <FontAwesomeIcon
                icon={order.dir === 'ASC' ? sortAscIcon : sortDescIcon}
                className="ordering-dropdown__sort-icon"
              />
            )}
          </DropdownItem>
        ))}
        <DropdownItem divider />
        <DropdownItem disabled={!order.field} onClick={() => onChange()}>
          <i>Clear selection</i>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}
