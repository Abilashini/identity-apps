/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { getAppConfig } from "@wso2is/core/api";
import { CommonHelpers, isPortalAccessGranted } from "@wso2is/core/helpers";
import { CommonDeploymentConfigInterface, emptyIdentityAppsSettings } from "@wso2is/core/models";
import {
    setDeploymentConfigs,
    setFeatureConfigs,
    setI18nConfigs,
    setServiceResourceEndpoints,
    setUIConfigs
} from "@wso2is/core/store";
import { LocalStorageUtils } from "@wso2is/core/utils";
import { I18n, I18nModuleOptionsInterface } from "@wso2is/i18n";
import { ContentLoader, ThemeContext } from "@wso2is/react-components";
import _ from "lodash";
import React, { ReactElement, Suspense, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { I18nextProvider } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { getPortalDocumentationStructure } from "./api";
import { ProtectedRoute } from "./components";
import { Config, baseRoutes } from "./configs";
import { ApplicationConstants } from "./constants";
import { history } from "./helpers";
import {
    ConfigInterface,
    ConfigReducerStateInterface,
    FeatureConfigInterface,
    ServiceResourceEndpointsInterface,
    UIConfigInterface
} from "./models";
import { AppState } from "./store";
import { setHelpPanelDocStructure } from "./store/actions";

/**
 * Main App component.
 *
 * @return {React.ReactElement}
 */
export const App = (): ReactElement => {

    const { state } = useContext(ThemeContext);

    const dispatch = useDispatch();

    const [ isAppLoading, setAppLoadingStatus ] = useState<boolean>(false);

    const userName: string = useSelector((state: AppState) => state.authenticationInformation.username);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const loginInit: boolean = useSelector((state: AppState) => state.authenticationInformation.loginInit);

    /**
     * Set the deployment configs in redux state.
     */
    useEffect(() => {
        // Replace `RuntimeConfigInterface` with the proper deployment config interface,
        // once runtime config is refactored.
        dispatch(setDeploymentConfigs<CommonDeploymentConfigInterface>(Config.getDeploymentConfig()));
        dispatch(setServiceResourceEndpoints<ServiceResourceEndpointsInterface>(Config.getServiceResourceEndpoints()));
        dispatch(setI18nConfigs<I18nModuleOptionsInterface>(Config.getI18nConfig()));
        dispatch(setUIConfigs<UIConfigInterface>(Config.getUIConfig()));
    }, []);

    /**
     * Set the help panel documentation structure in redux state.
     */
    useEffect(() => {
        getPortalDocumentationStructure()
            .then((response) => {
                dispatch(setHelpPanelDocStructure(response));
            });
    }, []);

    /**
     * Set the app loading status based on the availability of configs.
     */
    useEffect(() => {
        if (config?.deployment && !_.isEmpty(config.deployment) && config?.endpoints && !_.isEmpty(config.endpoints)) {
            setAppLoadingStatus(false);
        }

        setAppLoadingStatus(true);
    }, [ config ]);

    /**
     * Obtain app.config.json from the server root when the app mounts.
     */
    useEffect(() => {
        if (!config?.deployment || _.isEmpty(config.deployment) || !config.deployment.appBaseNameWithoutTenant) {
            return;
        }

        // Since the portals are not deployed per tenant, looking for static resources in tenant qualified URLs
        // will fail. Using `appBaseNameWithoutTenant` will create a path without the tenant. Therefore,
        // `getAppConfig()` will look for the app config file in `https://localhost:9443/developer-portal` rather than
        // looking it in `https://localhost:9443/t/wso2.com/developer-portal`.
        getAppConfig<ConfigInterface>(ApplicationConstants.APP_CONFIG_FILE_NAME,
            config.deployment.appBaseNameWithoutTenant)
            .then((response) => {
                dispatch(setFeatureConfigs<FeatureConfigInterface>(response?.features));
            })
            .catch(() => {
                // TODO: Log the error here.
            });
    }, [ config?.deployment?.appBaseNameWithoutTenant ]);

    /**
     * Set the application settings of the user to the local storage.
     */
    useEffect(() => {
        if (!userName && userName === "") {
            return;
        }

        const tenant = config?.deployment?.tenant;
        const tenantAppSettings = JSON.parse(LocalStorageUtils.getValueFromLocalStorage(tenant));
        const appSettings = {};

        appSettings[userName] = emptyIdentityAppsSettings();

       if (!tenantAppSettings) {
           LocalStorageUtils.setValueInLocalStorage(tenant, JSON.stringify(appSettings));
       } else {
           if (CommonHelpers.lookupKey(tenantAppSettings, userName) === null) {
               const newUserSettings = {
                   ...tenantAppSettings,
                   [ userName ]: emptyIdentityAppsSettings()
               };
               LocalStorageUtils.setValueInLocalStorage(tenant, JSON.stringify(newUserSettings));
           }
       }

    }, [ config?.deployment?.tenant, userName ]);

    /**
     * Checks if the portal access should be granted based on the feature config.
     */
    useEffect(() => {
        if (!config?.features || !loginInit) {
            return;
        }

        if (isPortalAccessGranted<FeatureConfigInterface>(config.features)) {
            return;
        }

        history.push(ApplicationConstants.PATHS.get("UNAUTHORIZED"));
    }, [ config?.features, loginInit ]);

    return (
        <>
            {
                isAppLoading
                    ? (
                        <Router history={ history }>
                            <div className="container-fluid">
                                <I18nextProvider i18n={ I18n.instance }>
                                    <Suspense fallback={ <ContentLoader dimmer/> }>
                                        <Helmet>
                                            <link
                                                href={ `${window["AppUtils"].getConfig().clientOrigin}/` + 
                                                    `${window["AppUtils"].getConfig().appBase}/libs/themes/` + 
                                                    `${ state.theme }/theme.min.css` }
                                                rel="stylesheet"
                                                type="text/css"
                                            />
                                            <style type="text/css">
                                                { state.css }
                                            </style>
                                        </Helmet>
                                        <Switch>
                                            <Redirect
                                                exact={ true }
                                                path="/"
                                                to={ config.deployment.appLoginPath }
                                            />
                                            {
                                                baseRoutes.map((route, index) => {
                                                    return (
                                                        route.protected ?
                                                            (
                                                                <ProtectedRoute
                                                                    component={ route.component }
                                                                    path={ route.path }
                                                                    key={ index }
                                                                    exact={ route.exact }
                                                                />
                                                            )
                                                            :
                                                            (
                                                                <Route
                                                                    path={ route.path }
                                                                    render={ (props) =>
                                                                        (<route.component { ...props } />)
                                                                    }
                                                                    key={ index }
                                                                    exact={ route.exact }
                                                                />
                                                            )
                                                    );
                                                })
                                            }
                                        </Switch>
                                    </Suspense>
                                </I18nextProvider>
                            </div>
                        </Router>
                    )
                    : <ContentLoader dimmer/>
            }
        </>
    );
};
