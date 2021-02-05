import React, { FC, useEffect, useState } from 'react';
import styles from './header.scss';

const Header: FC = () => {
    
    return (
        <div className={ [styles.header, 'footer'].join(' ') }>
            <p>Header</p>
        </div>       
    );
};

export default Header;