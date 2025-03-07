import {Align, Justify, ReactUiBase} from '@wonderlandengine/react-ui';
import React, {use, useEffect, useState} from 'react';
import {
    Button,
    Column,
    Container,
    Image,
    MaterialContext,
    Panel,
    Row,
    Text,
} from '@wonderlandengine/react-ui/components';

import {UiTextures} from './ui-textures.js';
import {GridGenerator} from '../components/grid-generator.js';
import {UserActions} from '../enums/UserActions.js';
import {HudModel} from '../models/HudModel.js';
import {AudioManager} from '../components/audio-manager.js';
import {Sounds} from '../enums/Sounds.js';

function onFlagClick() {
    AudioManager.instance.play(Sounds.click);
    GridGenerator.instance.userAction = UserActions.PlaceFlag;
}

function onPlayAgainClick() {
    AudioManager.instance.play(Sounds.click);
    GridGenerator.instance.restart();
}

const App = (props: {comp: Hud}) => {
    const [showWin, setShowWin] = useState(HudModel?.instance?.winState ?? false);
    const [showLost, setShowLost] = useState(HudModel?.instance?.loosingState ?? false);

    useEffect(() => {
        const propChanged = (prop: string) => {
            if (prop === 'winState') {
                setShowWin(HudModel.instance.winState);
            }
            if (prop === 'loosingState') {
                setShowLost(HudModel.instance.loosingState);
            }
        };

        HudModel.instance.propertyChanged.add(propChanged);

        return () => {
            HudModel.instance.propertyChanged.remove(propChanged);
        };
    }, []);

    return (
        <MaterialContext.Provider value={props.comp}>
            <Container width="100%" height="100%">
                <Column height="100%" padding={10}>
                    <Container key="Top"></Container>
                    <Container
                        key="Middle"
                        flexGrow={1}
                        justifyContent={Justify.Center}
                        alignItems={Align.Center}
                    >
                        {(showWin || showLost) && (
                            <Panel
                                rounding={4}
                                backgroundColor="#333333"
                                width={400}
                                height={300}
                                justifyContent={Justify.Center}
                                alignItems={Align.Center}
                            >
                                <Column>
                                    <Text
                                        textAlign="center"
                                        fontSize={80}
                                        text={showWin ? 'You Win!' : 'Game Over!'}
                                    ></Text>
                                    <Button
                                        margin={10}
                                        width={160}
                                        height={80}
                                        rounding={4}
                                        backgroundColor={'#000055'}
                                        hovered={{
                                            backgroundColor: '#222288',
                                        }}
                                        active={{}}
                                        justifyContent={Justify.Center}
                                        alignItems={Align.Center}
                                        onClick={() => onPlayAgainClick()}
                                    >
                                        <Text
                                            textAlign="center"
                                            text="Play Again"
                                            fontSize={32}
                                        ></Text>
                                    </Button>
                                </Column>
                            </Panel>
                        )}
                    </Container>
                    <Panel
                        key="Bottom"
                        alignSelf={Align.Center}
                        rounding={4}
                        minWidth={400}
                        height={100}
                        backgroundColor="#333333"
                    >
                        <Row>
                            <Button
                                margin={10}
                                width={80}
                                height={80}
                                rounding={4}
                                backgroundColor={'#000055'}
                                hovered={{
                                    backgroundColor: '#222288',
                                }}
                                active={{}}
                                justifyContent={Justify.Center}
                                alignItems={Align.Center}
                                onClick={() => onFlagClick()}
                            >
                                <Image
                                    rounding={0}
                                    src={UiTextures.instance.flag}
                                    width={50}
                                    height={50}
                                ></Image>
                            </Button>
                        </Row>
                    </Panel>
                </Column>
            </Container>
        </MaterialContext.Provider>
    );
};

export class Hud extends ReactUiBase {
    static TypeName = 'ui:hud';
    static InheritProperties = true;

    override async start(): Promise<void> {
        super.start();
    }

    override update(dt: number) {
        super.update(dt);
    }

    render() {
        return <App comp={this} />;
    }
}
