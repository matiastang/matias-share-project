import React, { FC, useEffect, useState } from 'react';
import styles from './footer.scss';

const Footer: FC = () => {
    
    return (
        <div className={ [styles.footer, 'footer'].join(' ') }>
            <p>Footer</p>
        </div>      
    );
};

export default Footer;