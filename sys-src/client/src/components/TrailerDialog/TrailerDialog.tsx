import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { IMovie } from '../../model/IMovie';
import YouTube from 'react-youtube';
import { Skeleton } from '@mui/material';
import { useWindowSize } from 'usehooks-ts';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    movie: IMovie;
}

export default function TrailerDialog({ open, setOpen, movie }: IProps) {
    const { width, height } = useWindowSize();
    const [mount, setMount] = useState(false);

    const wWidth = width < 1300 ? width / 1.2 : width / 1.5;
    const wHeight = height / 1.5;

    const handleClose = () => {
        setMount(false);
        setOpen(false);
    };

    const opts = {
        height: wHeight,
        width: wWidth,
        playerVars: {
            autoplay: 1,
        },
    };

    useEffect(() => {
        setTimeout(() => {
            setMount(true);
        }, 500);
    }, []);

    return (
        <Dialog
            data-testid="trailerDialog"
            style={{ background: 'rgba(1,1,1,0.86)' }}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            maxWidth="xl"
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <div className="bg-black">
                {mount && (
                    <YouTube
                        videoId={movie.trailer.split('v=')[1].split('&')[0]}
                        opts={opts}
                        loading={'lazy'}
                    />
                )}
                {!mount && (
                    <Skeleton
                        variant="rectangular"
                        width={wWidth}
                        height={wHeight}
                    />
                )}
            </div>
        </Dialog>
    );
}
