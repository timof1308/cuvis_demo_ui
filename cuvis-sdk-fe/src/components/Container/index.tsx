import * as React from 'react';
import { ReactNode } from 'react';
import "./Container.scss"

export interface IindexProps {
    children: ReactNode;
}

const index: React.FunctionComponent<IindexProps> = (props: IindexProps) => {
    return (
        <div className="container">
            {props.children}
        </div>
    );
}

export default index;