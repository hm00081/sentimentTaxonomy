// Types
import { SankeyLinkExtended, SankeyNodeExtended, SankeyData, SankeyLink } from '../../types/sankey';
import './Sankey.css';
import { FC, useState, useEffect, useCallback } from 'react';
import { Utility } from '../../utils/sankey/basics';
import { SourceTargetIdLinksDict } from './Sankey';
import { useRef, Component } from 'react';
import * as d3 from 'd3';
import { brush, brushY } from 'd3-brush';
import Brushes from './Brushes';
// import Brush from './Brush';
import styled from 'styled-components';
import { numberTypeAnnotation } from '@babel/types';
// import { Types } from './AreaChartHelper';
import useWindowDimensions from './WindowDimensions';
import ChartHelper from './AreaChartHelper';
import { link, linkSync } from 'fs';
import { calcSankeyNodes, calcSankeyLinks } from '../../utils/';
import { BrushBehavior } from 'd3-brush';
import { render } from '@testing-library/react';
import lodash, { result } from 'lodash';

const NodePos = styled.g`
    margin-top: 102px;
`;

const NodeName = styled.text`
    margin-top: 12px;
`;

// Props
interface LinkProps {
    node: SankeyNodeExtended;
    nodes: SankeyNodeExtended[];
    link: SankeyLinkExtended;
    originData: SankeyData;
    setOriginData: React.Dispatch<React.SetStateAction<SankeyData>>;
    sourceTargetIdLinksDict: SourceTargetIdLinksDict;
}

export namespace Types {
    export type Data = {
        date?: string;
        value?: number;
    };
    export type Dimensions = {
        width: number;
        height: number;
        margin: {
            left: number;
            right: number;
            top: number;
            bottom: number;
        };
        boundedWidth?: number;
        boundedHeight?: number;
    };
}

interface IBrushProps {
    dimensions: Types.Dimensions;
    data: Types.Data[];
    node?: SankeyNodeExtended;
    link?: SankeyLinkExtended;
    propertiesNames: string[];
    onBrushUpdateData: (value: Date[]) => void;
    stroke: string;
    x: number;
    y: number;
}

// Component
export const Link = ({ nodes, node, link, originData, sourceTargetIdLinksDict, setOriginData }: LinkProps) => {
    const linkst = {
        linkStatus: false,
    };
    // console.log(originData);
    const renderingData: SankeyData = { ...originData }; // ?????? (????????? ??????)
    const onClickFunction = () => {
        const renderingData: SankeyData = { ...originData };
        renderingData.positionStatus = 'clicked';
        renderingData.links = renderingData.links.map((link) => {
            return { ...link };
        });

        const selectedLinkPart = sourceTargetIdLinksDict[`${link.source}-${link.target}-${link.valueid}-${link.paperName}`];

        let results = [];

        let heads = [];
        let tails = [];

        /*
        do {



        } while ()

        100 ~ 155??? source??? ????????? ??? ?????? x


        const heads = _.filter(renderingData.links, d => d.paperName === selectedLinkPart.paperName && selectedLinkPart.source === d.target)

        const tails =  _.filter(renderingData.links, d => d.paperName === selectedLinkPart.paperName && selectedLinkPart.target === d.source)
        76 ~ 99???  target?????? ????????? ??? ?????? x

        */

        console.log(selectedLinkPart);
        renderingData.links.forEach((renderingLink) => {
            renderingLink.color = 'grayLinkColor';
            // renderingLink.valueid = undefined; // ?????? ??????
            renderingLink.status = undefined;
            // console.log(renderingData.links.length);
            selectedLinkPart.forEach((linkPart) => {
                // if (link.color === 'grayLinkColor') {
                //     return false;
                // }
                if (renderingLink.id && renderingLink.id === linkPart.id) {
                    //TODO inter, rep??? ???????????? ????????? ?????? ?????? ??????
                    if (renderingLink.target >= 0 && renderingLink.target <= 7) {
                        renderingLink.color = 'targetLinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target >= 8 && renderingLink.target <= 10) {
                        renderingLink.color = 'targetLinkOneColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target >= 11 && renderingLink.target <= 15) {
                        renderingLink.color = 'targetLinkTwoColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target >= 16 && renderingLink.target <= 20) {
                        renderingLink.color = 'targetLinkThreeColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target >= 21 && renderingLink.target <= 30) {
                        renderingLink.color = 'targetLinkFourColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if ((renderingLink.target >= 31 && renderingLink.target <= 33) || (renderingLink.source >= 31 && renderingLink.source <= 33)) {
                        renderingLink.color = 'intOneLinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target === 34 || renderingLink.source === 34) {
                        renderingLink.color = 'intOneLightLinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target === 35 || renderingLink.source === 35) {
                        renderingLink.color = 'intOneLight2LinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if ((renderingLink.target >= 36 && renderingLink.target <= 38) || (renderingLink.source >= 36 && renderingLink.source <= 38)) {
                        renderingLink.color = 'intOneLight3LinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target === 39 || renderingLink.source === 39) {
                        renderingLink.color = 'intTwoLinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target === 40 || renderingLink.source === 40) {
                        renderingLink.color = 'intTwoLightLinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target === 41 || renderingLink.source === 41) {
                        renderingLink.color = 'intThreeLinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target === 42 || renderingLink.source === 42) {
                        renderingLink.color = 'intThreeLightLinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target === 43 || renderingLink.source === 43) {
                        renderingLink.color = 'intThreeLight1LinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target === 44 || renderingLink.source === 44) {
                        renderingLink.color = 'intThreeLight2LinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target === 45 || renderingLink.source === 45) {
                        renderingLink.color = 'intFourLinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target === 46 || renderingLink.source === 46) {
                        renderingLink.color = 'intFiveLinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if ((renderingLink.target >= 47 && renderingLink.target <= 48) || (renderingLink.source >= 47 && renderingLink.source <= 48)) {
                        renderingLink.color = 'intFiveLightLinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target === 49 || renderingLink.source === 49) {
                        renderingLink.color = 'intFiveLight2LinkColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target >= 76 && renderingLink.target < 83) {
                        renderingLink.color = 'repVisVarColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                    if (renderingLink.target > 82 && renderingLink.target < 100) {
                        renderingLink.color = 'repVisTechColor';
                        // renderingLink.valueid = 'selected';
                        //renderingLink.status = 'selected';
                    }
                }
            });
        });

        selectedLinkPart.forEach((selectedLinkPart) => {
            findFrontLinks({
                linkPart: selectedLinkPart,
                renderingData,
            });
            findBackLinks({
                linkPart: selectedLinkPart,
                renderingData,
            });
        });
        if (link.color === 'grayLinkColor') {
            setOriginData(originData);
        } else setOriginData(renderingData);
    };

    return (
        <>
            <path
                className="link"
                d={link.path}
                stroke={`url(#${link.color})`}
                strokeWidth={link.value}
                fill="none"
                onMouseEnter={() => {
                    setOriginData(renderingData);
                }}
                onMouseLeave={() => {
                    setOriginData(originData);
                }}
                onClick={onClickFunction}
            >
                {link.color !== 'grayLinkColor' && link.process ? (
                    <title className="info">{`${link.paperName}: ${link.sourceNode.name} ??? ${link.targetNode.name}: ${link.value}`}</title>
                ) : (
                    <h1>{`${link.sourceNode.name} to ${link.targetNode.name}: ${link.value}`}</h1>
                )}
            </path>
            {/* <Brushes /> */}
            {/* <Brush dimensions={dimensions.current} data={data} onBrushUpdateData={onBrushUpdateData} propertiesNames={propertiesNames} stroke="rgb(47, 74, 89)" /> */}
        </>
    );
};

function findFrontLinks(arg: { linkPart: SankeyLink; renderingData: SankeyData }) {
    const { linkPart, renderingData } = arg;

    // console.log(arg);
    // console.log(linkPart.valueid);
    const frontLinks = renderingData.links.filter((renderingLink) => {
        // if (renderingLink.target === linkPart.source && renderingLink.id === linkPart.id) {
        if (renderingLink.target === linkPart.source && renderingLink.paperName === linkPart.paperName) {
            if (renderingLink.target >= 0 && renderingLink.target <= 8) {
                renderingLink.color = 'targetLinkColor';
                //  renderingLink.valueid = 'selected';
                // renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
                renderingLink.status = 'selected';
            } else if (renderingLink.target >= 8 && renderingLink.target <= 10) {
                renderingLink.color = 'targetLinkOneColor';
                //  renderingLink.valueid = 'selected';
                // renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
                renderingLink.status = 'selected';
            } else if (renderingLink.target >= 11 && renderingLink.target <= 15) {
                renderingLink.color = 'targetLinkTwoColor';
                //  renderingLink.valueid = 'selected';
                // renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
                renderingLink.status = 'selected';
            } else if (renderingLink.target >= 16 && renderingLink.target <= 20) {
                renderingLink.color = 'targetLinkThreeColor';
                //  renderingLink.valueid = 'selected';
                // renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
                renderingLink.status = 'selected';
            } else if (renderingLink.target >= 21 && renderingLink.target <= 30) {
                renderingLink.color = 'targetLinkFourColor';
                //  renderingLink.valueid = 'selected';
                // renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
                renderingLink.status = 'selected';
            }
            if (renderingLink.target >= 31 && renderingLink.target <= 33) {
                renderingLink.color = 'intOneLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target === 34) {
                renderingLink.color = 'intOneLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source === 34) {
                renderingLink.color = 'intOneLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target === 35) {
                renderingLink.color = 'intOneLight2LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source === 35) {
                renderingLink.color = 'intOneLight2LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target >= 36 && renderingLink.target <= 38) {
                renderingLink.color = 'intOneLight3LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source >= 36 && renderingLink.source <= 38) {
                renderingLink.color = 'intOneLight3LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target === 39) {
                renderingLink.color = 'intTwoLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source === 39) {
                renderingLink.color = 'intTwoLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target === 40) {
                renderingLink.color = 'intTwoLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source === 40) {
                renderingLink.color = 'intTwoLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target === 41) {
                renderingLink.color = 'intThreeLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source === 41) {
                renderingLink.color = 'intThreeLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target === 42) {
                renderingLink.color = 'intThreeLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source === 42) {
                renderingLink.color = 'intThreeLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target === 43) {
                renderingLink.color = 'intThreeLight1LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source === 43) {
                renderingLink.color = 'intThreeLight1LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target === 44) {
                renderingLink.color = 'intThreeLight2LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source === 44) {
                renderingLink.color = 'intThreeLight2LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target === 45) {
                renderingLink.color = 'intFourLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source === 45) {
                renderingLink.color = 'intFourLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target === 46) {
                renderingLink.color = 'intFiveLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source === 46) {
                renderingLink.color = 'intFiveLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target >= 47 && renderingLink.target <= 48) {
                renderingLink.color = 'intFiveLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source >= 47 && renderingLink.source <= 48) {
                renderingLink.color = 'intFiveLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.target === 49) {
                renderingLink.color = 'intFiveLight2LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source === 49) {
                renderingLink.color = 'intFiveLight2LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            } else if (renderingLink.source >= 50 && renderingLink.source <= 75) {
                renderingLink.color = linkPart.color;
            } else if (renderingLink.target >= 50 && renderingLink.target <= 75) {
                renderingLink.color = linkPart.color;
            }
            return true;
        } else {
            return false;
        }
    });

    console.log(frontLinks);

    frontLinks.forEach((linkPart) => {
        findFrontLinks({
            linkPart,
            renderingData,
        }); //recursive forward calculate function
    });

    // result.push (itself, othhers)

    // result.,foreahc
}

function findBackLinks(arg: { linkPart: SankeyLink; renderingData: SankeyData }) {
    const { linkPart, renderingData } = arg;
    const backLinks = renderingData.links.filter((renderingLink) => {
        // if (renderingLink.source === linkPart.target && renderingLink.id === linkPart.id) {
        // if (renderingLink.source === linkPart.target && renderingLink.paperName === linkPart.paperName) {
        //     if (renderingLink.source >= 50 && renderingLink.source <= 75) {
        //         renderingLink.color = linkPart.color;
        //     }
        //     if (renderingLink.target >= 50 && renderingLink.target <= 75) {
        //         renderingLink.color = linkPart.color;
        //     }
        //     if (renderingLink.target >= 76 && renderingLink.target < 83) {
        //         renderingLink.color = 'repVisVarColor';
        //         renderingLink.valueid = linkPart.valueid;
        //         //renderingLink.status = 'selected';
        //         renderingLink.paperName = linkPart.paperName;
        //         // renderingLink.process = linkPart.process;
        //     }
        //     if (renderingLink.target > 82 && renderingLink.target < 100) {
        //         renderingLink.color = 'repVisTechColor';
        //         renderingLink.valueid = linkPart.valueid;
        //         //renderingLink.status = 'selected';
        //         renderingLink.paperName = linkPart.paperName;
        //         // renderingLink.process = linkPart.process;
        //     }
        //     return true;
        // }
        if (renderingLink.source === linkPart.target && renderingLink.paperName === linkPart.paperName) {
            if (renderingLink.target >= 31 && renderingLink.target <= 33) {
                renderingLink.color = 'intOneLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target === 34) {
                renderingLink.color = 'intOneLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source === 34) {
                renderingLink.color = 'intOneLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target === 35) {
                renderingLink.color = 'intOneLight2LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source === 35) {
                renderingLink.color = 'intOneLight2LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target >= 36 && renderingLink.target <= 38) {
                renderingLink.color = 'intOneLight3LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source >= 36 && renderingLink.source <= 38) {
                renderingLink.color = 'intOneLight3LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target === 39) {
                renderingLink.color = 'intTwoLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source === 39) {
                renderingLink.color = 'intTwoLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target === 40) {
                renderingLink.color = 'intTwoLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source === 40) {
                renderingLink.color = 'intTwoLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target === 41) {
                renderingLink.color = 'intThreeLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source === 41) {
                renderingLink.color = 'intThreeLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target === 42) {
                renderingLink.color = 'intThreeLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source === 42) {
                renderingLink.color = 'intThreeLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target === 43) {
                renderingLink.color = 'intThreeLight1LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source === 43) {
                renderingLink.color = 'intThreeLight1LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target === 44) {
                renderingLink.color = 'intThreeLight2LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source === 44) {
                renderingLink.color = 'intThreeLight2LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target === 45) {
                renderingLink.color = 'intFourLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source === 45) {
                renderingLink.color = 'intFourLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target === 46) {
                renderingLink.color = 'intFiveLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source === 46) {
                renderingLink.color = 'intFiveLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target >= 47 && renderingLink.target <= 48) {
                renderingLink.color = 'intFiveLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source >= 47 && renderingLink.source <= 48) {
                renderingLink.color = 'intFiveLightLinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target === 49) {
                renderingLink.color = 'intFiveLight2LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source === 49) {
                renderingLink.color = 'intFiveLight2LinkColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.source >= 50 && renderingLink.source <= 75) {
                renderingLink.color = linkPart.color;
            }
            if (renderingLink.target >= 50 && renderingLink.target <= 75) {
                renderingLink.color = linkPart.color;
            }
            if (renderingLink.target >= 76 && renderingLink.target < 83) {
                renderingLink.color = 'repVisVarColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            if (renderingLink.target > 82 && renderingLink.target < 100) {
                renderingLink.color = 'repVisTechColor';
                renderingLink.valueid = linkPart.valueid;
                //renderingLink.status = 'selected';
                renderingLink.paperName = linkPart.paperName;
                // renderingLink.process = linkPart.process;
            }
            return true;
        } else {
            return false;
        }
    });
    console.log(backLinks);

    backLinks.forEach((linkPart) => {
        findBackLinks({
            linkPart,
            renderingData,
        }); //recursive backward calculate  function
    });
}
