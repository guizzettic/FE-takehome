import React, { useState, useEffect } from "react"
import Loader from 'react-loader-spinner'
import { fetchShipments, FetchShipmentsResult } from "../data/fetch-shipments"
import { Box, makeStyles, useTheme } from "@material-ui/core"
import { DataGrid, GridColDef } from "@material-ui/data-grid"
import { sortShipmentData } from "../utility/utilities"

type LoadingResult = {
    status: 'LOADING'
}
const INITIAL_RESULT: LoadingResult = {
    status: 'LOADING'
}
const COLUMNS: GridColDef[] = [
    {
        field: 'houseBillNumber',
        headerName: 'House Bill',
        width: 200
    },
    {
        field: 'client',
        headerName: 'Shipper',
        width: 171
    },
    {
        field: 'origin',
        headerName: 'Origin',
        width: 200
    },
    {
        field: 'destination',
        headerName: 'Destination',
        width: 200
    },
    {
        field: 'mode',
        headerName: 'Mode',
        width: 200
    },
    {
        field: 'estimatedArrival',
        headerName: 'Estimated Arrival',
        width: 200
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 200
    }
]

const useStyles = makeStyles({
    grid: {
        marginInline: 16,
        height: '29vh'
    },
    loader: {
        margin: 'auto',
        width: 'fit-content',
        marginTop: 200
    },
    arrivalTitle: {
        paddingLeft: 17,
        textDecorationLine: 'underline',
        fontWeight: 800,
        paddingTop: 15
    },
    todaysDate: {
        fontWeight: 700,
        paddingTop: 20,
        textAlign: 'right',
        marginRight: 20,
        marginBottom: -62,
    }
})

export const DashboardPage: React.FC = () => {
    const [sortReady, setSortReady] = useState<boolean>(false)
    const [schedule, setSchedule] = useState<number[]>([])
    const classes = useStyles()
    const theme = useTheme()

    const [fetchShipmentsResult, setFetchShipmentsResult] = useState<FetchShipmentsResult | LoadingResult | any>(INITIAL_RESULT)
    useEffect(() => {
        fetchShipments().then(result => { 
            setFetchShipmentsResult(result) 
        })
    }, [])

    useEffect(() => {
        if (fetchShipmentsResult.status === 'SUCCESS') {
            setSchedule(sortShipmentData(fetchShipmentsResult.shipments)) 
            setSortReady(true)
        }  
    }, [fetchShipmentsResult])


    return <div>
        {!sortReady ? 
            <Box className={classes.loader}>
                <Loader type="Grid" color={theme.palette.primary.main} />
            </Box > :

        <h2 className={classes.todaysDate}>Todays Date: {new Date().toLocaleDateString()}</h2>
        }
        {schedule && schedule.map((idx: any, key: number) => idx.length > 0 && (
            <div key={key}>
                <h2 className={classes.arrivalTitle}>Arriving on {idx[0].estimatedArrival}</h2>
                <DataGrid
                    className={classes.grid}
                    rows={idx}
                    columns={COLUMNS}
                    pagination
                    disableSelectionOnClick
                    autoPageSize
                    key={idx.houseBillNumber}
                />
            </div>
        ))}
     </div>
}