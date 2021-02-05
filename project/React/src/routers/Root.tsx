import React, { FC, useEffect, useState } from 'react';
import { Route } from 'react-router';
import { HashRouter, Switch } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Content from '../components/contentLayout/ContentLayout';
import Home from '../components/home/Home';

const Root: FC = () => {
    
    return (
        <>
            <Header/>
            <HashRouter>
                <Switch>
                    {/* <Route path="/" exact  component={ Home } />
                    <Route path="/home" exact  component={ Home } />
                    <Route component={() =><div>404</div> } /> */}
                    <Route path="/" component={() => (
                        // <Content>
                            <Switch>
                                <Route exact path="/home" component={ Home }/>
                                <Route exact path="/test" component={ Home }/>
                                <Route path="*" component={() =><div>404</div> } />
                            </Switch>
                        // </Content>
                    )} />
                    <Route component={() =><div>404</div> } />
                </Switch>
            </HashRouter>
            <Footer/>
        </>
    );
};

export default Root;