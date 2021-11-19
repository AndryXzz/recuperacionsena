import { List, ListItemButton } from '@mui/material'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import * as React from 'react'
import './sideBar.css'
import DashboardIcon from '@mui/icons-material/Dashboard';
import { styled } from '@mui/material/styles';

export const SideBar = () => {
  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
      padding: '10px',
      fontSize: '15px',
      letterSpacing: '1px'
    },
  }));
  return (
    <div className="sideBar">
      <List>
        <BootstrapTooltip title="Guías de aprendizaje" arrow placement="right">
          <ListItemButton>
            <DashboardIcon sx={{ color: '#fff' }} />
          </ListItemButton>
        </BootstrapTooltip>

      </List>
    </div>
  )
}
