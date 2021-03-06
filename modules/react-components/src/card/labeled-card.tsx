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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Card, CardProps, Label, LabelProps, Popup, SemanticSIZES } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Proptypes for the labeled card component.
 */
export interface LabeledCardPropsInterface extends TestableComponentInterface {
    /**
     * If a bottom margin should be added.
     */
    bottomMargin?: boolean;
    /**
     * Additional classes.
     */
    className?: string;
    /**
     * Is the card should be rendered as disabled.
     */
    disabled?: boolean;
    /**
     * The card will take the size of the container.
     */
    fluid?: boolean;
    /**
     * Id for the card.
     */
    id?: string;
    /**
     * Image to be displayed.
     */
    image: any;
    /**
     * Size of the image.
     */
    imageSize?: GenericIconSizes;
    /**
     * Should the card be inline.
     */
    inline?: boolean;
    /**
     * Label of the card.
     */
    label: string;
    /**
     * Label ellipsis.
     */
    labelEllipsis?: boolean;
    /**
     * On click callback for the element.
     */
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: CardProps) => void;
    /**
     * On click callback for the close button.
     */
    onCloseClick?: (event: React.MouseEvent<HTMLElement>, data: LabelProps) => void;
    /**
     * If the card should appear as selected.
     */
    selected?: boolean;
    /**
     * Set of sizes. Only tiny is currently supported.
     */
    size?: SemanticSIZES;
}

/**
 * Labeled card component.
 *
 * @param {LabeledCardPropsInterface} props - Props injected to the components.
 *
 * @return {React.ReactElement}
 */
export const LabeledCard: FunctionComponent<LabeledCardPropsInterface> = (
    props: LabeledCardPropsInterface
): ReactElement => {

    const {
        bottomMargin,
        className,
        disabled,
        fluid,
        id,
        inline,
        image,
        imageSize,
        label,
        labelEllipsis,
        onClick,
        onCloseClick,
        selected,
        size,
        [ "data-testid" ]: testId
    } = props;

    const wrapperClasses = classNames(
        "labeled-card-wrapper",
        {
            fluid,
            inline,
            [ size ]: size,
            [ "with-bottom-margin" ]: bottomMargin
        },
        className
    );

    const cardClasses = classNames(
        "labeled-card",
        {
            disabled,
            selected,
            [ "with-image" ]: image
        }
    );

    return (
        <div className={ wrapperClasses } data-testid={ `${ testId }-wrapper` }>
            <Card
                id={ id }
                as="div"
                className={ cardClasses }
                onClick={ onClick }
                link={ false }
                data-testid={ testId }
            >
                { onCloseClick && (
                    <Label
                        className="close-button"
                        color="red"
                        size="mini"
                        onClick={ onCloseClick }
                        data-testid={ `${ testId }-close-button` }
                        floating
                        circular
                    >
                        x
                    </Label>
                ) }
                <Card.Content className="card-image-container">
                    <GenericIcon
                        className="card-image"
                        size={ imageSize }
                        icon={ image }
                        data-testid={ `${ testId }-image` }
                        square
                        transparent
                    />
                </Card.Content>
            </Card>
            <Popup
                disabled={ !labelEllipsis }
                trigger={ <div className={ "card-label" + labelEllipsis ? " ellipsis" : "" }>{ label }</div> }
                position="bottom center"
                content={ label }
                data-testid={ `${ testId }-label` }
                inverted
            />
        </div>
    );
};

/**
 * Default props for the labeled card component.
 */
LabeledCard.defaultProps = {
    bottomMargin: true,
    "data-testid": "labeled-card",
    imageSize: "mini",
    inline: true,
    onClick: () => null
};
