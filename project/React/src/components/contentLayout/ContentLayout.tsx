import React, { FC, useEffect, useState } from 'react';
import styles from './contentLayout.scss';

const ContentLayout: FC = (props) => {
    
    return (
        <div className={ styles.content }>
            { props.children }
        </div>      
    );
};

export default ContentLayout;