import { faCheck as checkIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import type { ServerWithId } from './data';
import type { ManageServersRowDropdownProps } from './ManageServersRowDropdown';

export interface ManageServersRowProps {
  server: ServerWithId;
  hasAutoConnect: boolean;
}

export const ManageServersRow = (
  ManageServersRowDropdown: FC<ManageServersRowDropdownProps>,
): FC<ManageServersRowProps> => ({ server, hasAutoConnect }) => (
  <tr className="responsive-table__row">
    {hasAutoConnect && (
      <td className="responsive-table__cell" data-th="Auto-connect">
        {server.autoConnect && (
          <>
            <FontAwesomeIcon icon={checkIcon} className="text-primary" id="autoConnectIcon" />
            <UncontrolledTooltip target="autoConnectIcon" placement="right">
              Auto-connect to this server
            </UncontrolledTooltip>
          </>
        )}
      </td>
    )}
    <th className="responsive-table__cell" data-th="Name">
      <Link to={`/server/${server.id}`}>{server.name}</Link>
    </th>
    <td className="responsive-table__cell" data-th="Base URL">{server.url}</td>
    <td className="responsive-table__cell text-end">
      <ManageServersRowDropdown server={server} />
    </td>
  </tr>
);
