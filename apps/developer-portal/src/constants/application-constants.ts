/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

/**
 * Application settings key in local storage.
 * @constant
 * @type {string}
 * @default
 */
export const APPLICATION_SETTINGS_STORAGE_KEY = "application_settings";

/**
 * Primary userstore identifier.
 * @constant
 * @type {string}
 * @default
 */
export const PRIMARY_USER_STORE_IDENTIFIER = "PRIMARY";

/**
 * Path to the login error page.
 * @constant
 * @type {string}
 * @default
 */
export const LOGIN_ERROR_PAGE_PATH = "/login-error";

/**
 * Path to the 404 page.
 * @constant
 * @type {string}
 * @default
 */
export const PAGE_NOT_FOUND_PATH = "/404";

/**
 * Path to the applications page.
 * @constant
 * @type {string}
 * @default
 */
export const APPLICATIONS_PAGE_PATH = "/applications";

/**
 * Path to the local claims page.
 * @constant
 * @type {string}
 * @default
 */
export const LOCAL_CLAIMS_PATH = "/local-claims";

/**
 * Path to the edit external dialect page.
 * @constant
 * @type {string}
 * @default
 */
export const EDIT_EXTERNAL_DIALECT = "/edit-external-dialect";

/**
 * Path to the claim dialects page.
 * @constant
 * @type {string}
 * @default
 */
export const CLAIM_DIALECTS_PATH = "/claim-dialects";

/**
 * Path to the edit local claims page.
 * @constant
 * @type {string}
 * @default
 */
export const EDIT_LOCAL_CLAIMS_PATH = "/edit-local-claims";

/**
 * Path to the userstores page.
 * @constant
 * @type {string}
 * @default
 */
export const USER_STORES_PATH = "/user-stores";

/**
 * Path to the edit userstore page.
 * @constant
 * @type {string}
 * @default
 */
export const EDIT_USER_STORE_PATH = "/edit-user-store";

/**
 * Path to the userstore templates page.
 * @constant
 * @type {string}
 * @default
 */
export const USERSTORE_TEMPLATES_PATH = "/userstore-templates";

/**
 * User portal application identifier.
 * @constant
 * @type {string}
 * @default
 */
export const USER_PORTAL_IDENTIFIER = "This is the user portal application.";

/**
 * Error description when the user denies consent to the app
 * @constant
 * @type {string}
 * @default
 */
export const USER_DENIED_CONSENT = "User denied the consent";

/**
 * Class containing app constants.
 */
export class ApplicationConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Paths for the application management config files.
     * @constant
     * @type {object}
     */
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public static readonly APPLICATION_MGT_CONFIG_PATHS: any = {
        META: "configs/application-mgt.meta.json"
    };

    /**
     * Application Paths.
     * @constant
     * @type {Map<string, string>}
     */
    public static readonly PATHS: Map<string, string> = new Map<string, string>()
        .set("404", "/404")
        .set("UNAUTHORIZED", "/unauthorized")
        .set("APPLICATIONS", "/applications")
        .set("APPLICATION_TEMPLATES", "/applications/templates")
        .set("APPLICATION_EDIT", "/applications/:id")
        .set("ATTRIBUTE_DIALECTS", "/claim-dialects")
        .set("CERTIFICATES", "/certificates")
        .set("EMAIL_TEMPLATES", "/email-templates")
        .set("GENERAL_CONFIGS", "/server-configurations")
        .set("GROUPS", "/groups")
        .set("IDP", "/identity-providers")
        .set("IDP_EDIT", "/identity-providers/:id")
        .set("ROLES", "/roles");

    /**
     * Name of the app config file for the developer portal.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly APP_CONFIG_FILE_NAME: string = "app.config.json";

    /**
     * Path for the user portal personal info page.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly MY_ACCOUNT_PATH: string = "/personal-info";
}

/**
 * Key of the time at which an auth error occurred in the session storage
 * @constant
 * @type {string}
 * @default
 */
export const AUTH_ERROR_TIME = "authErrorTime";
