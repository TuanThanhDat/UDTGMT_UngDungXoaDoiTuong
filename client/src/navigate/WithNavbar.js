
import React from 'react';
import TopNavigate from './top_nav';
import { Outlet } from 'react-router';

export default () => {
    return (
        <>
            <TopNavigate/>
            <Outlet/>
        </>
    )
}