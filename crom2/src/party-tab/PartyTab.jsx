import * as React from 'react';

import ToggleButton from '@mui/material/ToggleButton';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { parties } from './data/parties'
import PartiesTables from './PartiesTables';
import MainPage from '../components/MainPage';
import PartiesCard from './PartiesCards'
import { Stack } from '@mui/material';


export default function SignIn(props) {

    const [view, setView] = React.useState(localStorage.getItem( 'partyPageSate' ) || 'list');

    const handleChange = (event, nextView) => {
        setView(nextView);
        localStorage.setItem( 'partyPageSate', nextView );
    };

    
    

    return (
        <Stack
                    spacing={2}
                    sx={{
                    alignItems: 'center',
                    mx: 3,
                    pb: 5,
                    mt: { xs: 8, md: 0, width: '90%' },
                    }}
                >
            {/* <Paper elevation={3}>
                <Box margin={1}>
                    <Typography variant='subtitle2'>
                    Horaires des séances de jeux des BDR
                    </Typography>
                    <List>
                        <li><b>Vendredi</b> : de 19H15 à 1H00 au foyer saint Vincent - Orléans.</li>
                        <li><b>Samedi</b> : de 14H00 à 20H00 à la Maison des associations d'Orléans.</li>
                    </List>
                </Box>
            </Paper> */}

            <ToggleButtonGroup
                orientation="horizontal"
                value={view}
                exclusive
                onChange={handleChange}
                >
                <ToggleButton value="table" aria-label="table">
                    <ViewListIcon />
                </ToggleButton>
                <ToggleButton value="card" aria-label="card">
                    <ViewModuleIcon />
                </ToggleButton>
                <ToggleButton value="quilt" aria-label="quilt">
                    <ViewQuiltIcon />
                </ToggleButton>
                {/* <ToggleButton value="table" aria-label="table">
                <span class="material-symbols-outlined">table</span>
                </ToggleButton> */}
            </ToggleButtonGroup>

            { view=='table' && <PartiesTables {...parties}/> }
            { view=='card' && <PartiesCard {...parties}/> }
            {/* { view=='quilt' && <TableAccordillon {...parties}/> } */}
        
        </Stack>
    );
}