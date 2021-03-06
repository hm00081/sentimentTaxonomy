// Libraries
import { linkHorizontal, line, curveCardinal } from 'd3-shape';
import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { makeDrag, makeSimulation, SvgGSelectionsMaker } from '../../components/Sankey/dragFunction';
// Types
import { SankeyData, SankeyLinkExtended, SankeyNodeExtended, SankeyLink, SankeyNode } from '../../types';
// import _, { forEach } from 'lodash';
import { Utility } from './basics';

export interface SourceTargetNodesDict {
    [sourceTargetId: string]: SankeyLinkExtended[];
}

export const calcSankeyLinks = (
    data: SankeyData,
    height: number,
    nodes: SankeyNodeExtended[],
    nodeWidth: number,
    minLinkBreadth?: number,
    maxLinkBreadth?: number,
    isSort: boolean = true
): SankeyLinkExtended[] => {
    // Extract to const so its in a closure
    const { links } = data;
    // console.log('data');
    // console.log(data);
    // Calc proportional size value

    const proportionalNodeWidth = nodeWidth * (height / 100);
    const proportionalMaxLinkBreadth = maxLinkBreadth && maxLinkBreadth * (height / 100);
    const proportionalMinLinkBreadth = minLinkBreadth && minLinkBreadth * (height / 100);
    // const [sourceNodeLinksDict, setSourceNodeLinksDict] = useState<SourceTargetNodesDict>({});
    const totalValue = nodes.map((node) => node.value).reduce((acc, cur) => (acc += cur), 0);

    // Extend Links to add additional data
    const extendedLinks = links.map((link) => {
        const sourceNode = nodes.filter((node) => node.index === link.source)[0];
        const targetNode = nodes.filter((node) => node.index === link.target)[0];
        const valueid = link.valueid;
        const color = link.color;
        const subcolor = link.subcolor;
        const overlapid = link.overlapid;
        const breadth = (link.value / totalValue) * height;
        const maxBreadth = proportionalMaxLinkBreadth ? Math.min(breadth, proportionalMaxLinkBreadth) : breadth;
        const minBreadth = proportionalMinLinkBreadth ? Math.max(breadth, proportionalMinLinkBreadth) : breadth;
        const linkBreadth = breadth > maxBreadth ? maxBreadth : minBreadth;
        const drag = makeDrag();
        // const simulation = makeSimulation(nodes, links);
        const extendedLink: SankeyLinkExtended = {
            ...link,
            sourceNode,
            sourceNodeYPosition: 0, // ?????? ????????? ?????? ???(type) ??????  0?????? ?????? ?????? ??????.
            targetNode,
            valueid,
            targetNodeYPosition: 0, // ?????? ????????? ?????? ???(type) ??????
            breadth: linkBreadth ? linkBreadth : 0,
            path: '',
            overlapid,
            color,
            subcolor,
        };
        // sourceNode.sourceNodeType += link.value;
        // targetNode.targetNodeType += link.value;

        return extendedLink;
    });

    // Calculate the path based on the positions of source and target node

    extendedLinks.forEach((link) => {
        if (link.sourceNode.x === link.targetNode.x) {
            const startPoint = [link.sourceNode.x + proportionalNodeWidth, link.sourceNode.height / 2 + link.sourceNode.y - nodeWidth / 2] as const;
            const endPoint = [link.targetNode.x + proportionalNodeWidth, link.targetNode.height / 2 + link.targetNode.y - nodeWidth / 2] as const;

            const data = [startPoint, [startPoint[0] + 5, startPoint[1]], [startPoint[0] + 20, (endPoint[1] - startPoint[1]) / 2 + startPoint[1]], [endPoint[0] + 5, endPoint[1]], endPoint] as [
                number,
                number
            ][];

            // d3-line, curveCardinal

            const path = line().curve(curveCardinal.tension(0.2))(data);

            if (!path) return;

            link.path = path;

            return;
        }
    });

    //node.breadth === value??? ?????? ?????? ????????? ??????.
    //?????? source, target????????? ?????? ???????????? ?????? ????????? ??????!!

    // source, targetCenter??? link??? ????????? ?????????
    //?????? ?????? ?????? / 2?????? ????????? ????????

    // const linksByEachGroup =
    //     {
    //         node1: [link, link, link],
    //         node2: [],
    //         node3: []
    //     }
    // ???????????? or ???????????????
    // const presourceNodeNameLinksDict: { [node: string]: SankeyLinkExtended[] } = {};

    // valueid??? ??? string ''??? ?????? ????????? ??????????????? ??????.
    // ???????????? or ???????????????
    const sourceNodeNameLinksDict: { [node: string]: SankeyLinkExtended[] } = {};

    extendedLinks.forEach((link) => {
        if (link.sourceNode.name! in sourceNodeNameLinksDict) {
            sourceNodeNameLinksDict[link.sourceNode.name!].push(link);
        } else {
            sourceNodeNameLinksDict[link.sourceNode.name!] = [link];
        }
    });

    const targetNodeNameLinksDict: { [node: string]: SankeyLinkExtended[] } = {};

    extendedLinks.forEach((link) => {
        if (link.targetNode.name! in targetNodeNameLinksDict) {
            targetNodeNameLinksDict[link.targetNode.name!].push(link);
            // sourceNodeNameLinksDict[link.targetNode.name!].push(link);
        } else {
            targetNodeNameLinksDict[link.targetNode.name!] = [link];
        }
    });

    // const targetNodeNameLinksDict: { [node: string]: SankeyLinkExtended[] } = {};
    // extendedLinks.forEach((link) => {
    //     // console.log(link.sourceNode.name);
    //     if (link.targetNode.name! in sourceNodeNameLinksDict) {
    //         targetNodeNameLinksDict[link.targetNode.name!].push(link);
    //     } else {
    //         targetNodeNameLinksDict[link.targetNode.name!] = [link];
    //     }
    // });

    // sort [key, value] entries.
    for (const [nodeName, linksOfNode] of Object.entries(sourceNodeNameLinksDict)) {
        // linksOfNode.sort((a, b) => b.value - a.value);
        // ????????? ????????? ??? ???????????? ????????? ???????????? ??????.
        if (isSort) {
            linksOfNode.sort((a, b) => {
                let tempNumber = 0;
                // if (a.valueid === 'repb' || a.valueid === 'repea') {
                //     if (b.valueid === 'repb' || b.valueid === 'repea') {
                if (a.color !== 'grayLinkColor') {
                    if (b.color !== 'grayLinkColor') {
                        // tempNumber = b.value - a.value;
                        //@ts-ignore
                        tempNumber = a.target - b.target;
                    } else {
                        tempNumber = -1;
                        // tempNumber = a.value - b.value;
                    }
                } else {
                    // if (b.valueid === 'repb' || b.valueid === 'repea') {
                    if (b.color !== 'grayLinkColor') {
                        tempNumber = 1;
                    } else {
                        // tempNumber = b.value - a.value;
                        //@ts-ignore
                        tempNumber = a.target - b.target;
                    }
                }
                return tempNumber;
            });
        }
        // ????????? ???????????? ????????? ????????? ?????? ????????? ???????????? ???????????? ??????
        // ?????? ??????????????? ?????? ????????? ?????? ???????????? ????????? ????????????.
        // ??? ????????? ???????????? ?????? forEach???.
        // sourceNode ???(????????? ?????? ????????? ??????).
        let tempYPosition: number = 0;
        linksOfNode.forEach((link, orderIndex) => {
            // ?????? target?????? ?????? source ?????? ????????? ???????????? ?????? y???(sourceOrderIndex)?????? ????????? ????????????. (?????? ???????????? ????????? ????????? ????????? ??? ??????.)
            // ????????? ?????? ????????? id??? ???????????? ??? ????????? ???????????? link.value??? ????????????.
            // if(link.subvalueid === 'overlap') {
            //     link.sourceNode.sourceNodeType = link.value;
            // } else {
            //     link.sourceNode.sourceNodeType += link.value;
            // }
            link.sourceNodeYPosition = tempYPosition;
            tempYPosition += link.value;
        });
    }
    // console.log(sourceNodeNameLinksDict);
    // console.log(targetNodeNameLinksDict);
    // ??? ???????????? sourcenode & targetvalue => ????????? targeetvalue == target??? source  === .....~~~~~ ?????? ??????????????? ????????????.

    for (const [nodeName, linksOfNode] of Object.entries(targetNodeNameLinksDict)) {
        if (isSort) {
            linksOfNode.sort((a, b) => {
                let tempNumber = 0;

                if (a.color !== 'grayLinkColor') {
                    if (b.color !== 'grayLinkColor') {
                        //@ts-ignore
                        tempNumber = a.source - b.source;
                    } else {
                        tempNumber = -1;
                    }
                } else {
                    if (b.color !== 'grayLinkColor') {
                        tempNumber = 1;
                    } else {
                        //@ts-ignore
                        tempNumber = a.source - b.source;
                    }
                }
                return tempNumber;
            });
        }
        let tempYPosition: number = 0;
        linksOfNode.forEach((link, orderIndex) => {
            link.targetNodeYPosition = tempYPosition;
            tempYPosition += link.value;
        });
    }

    extendedLinks.forEach((link) => {
        // source, targetCenter??? link??? ????????? ?????????
        const sourceCenter = (d: typeof extendedLinks[0]) => [d.sourceNode.x + proportionalNodeWidth, d.sourceNode.y + d.sourceNodeYPosition + d.value / 2];
        const targetCenter = (d: typeof extendedLinks[0]) => [d.targetNode.x, d.targetNode.y + d.targetNodeYPosition + d.value / 2];

        // d3-linkHorizontal
        let path = linkHorizontal<typeof extendedLinks[0], {}>().source(sourceCenter).target(targetCenter)(link);

        // if(link.source.length === n);
        if (!path) return null;

        link.path = path;

        // path.append('svg');
    });

    extendedLinks.sort((link) => (link.color !== 'grayLinkColor' ? 1 : -1)); // zIndex

    return extendedLinks;
};
