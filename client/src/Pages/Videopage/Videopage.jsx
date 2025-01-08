import React, { useEffect, useRef } from 'react';
import './Videopage.css';
import moment from 'moment';
import Likewatchlatersavebtns from './Likewatchlatersavebtns';
import { useParams, Link } from 'react-router-dom';
import Comment from '../../Component/Comment/Comment';
import { useSelector, useDispatch } from 'react-redux';
import { viewvideo } from '../../action/video';
import { addtohistory } from '../../action/history';
import { setcurrentuser } from '../../action/currentuser';
import axios from 'axios';

const Videopage = () => {
    const { vid } = useParams();
    const dispatch = useDispatch();
    const vids = useSelector((state) => state.videoreducer.data);
    const currentuser = useSelector((state) => state.currentuserreducer);
    const videoRef = useRef(null);

    const vv = vids?.filter((q) => q._id === vid)[0];

    const handleviews = () => {
        dispatch(viewvideo({ id: vid }));
    };

    const handlehistory = () => {
        dispatch(addtohistory({
            videoid: vid,
            viewer: currentuser?.result._id,
        }));
    };

    const handlePoints = async () => {
        const userId = currentuser?.result._id;

        try {
            const response = await axios.post('http://localhost:5000/user/updatePoints', {
                userId,
                pointsToAdd: 5
            });

            const updatedPoints = response.data.points;

            // Update points in frontend state
            dispatch(setcurrentuser({
                ...currentuser,
                result: {
                    ...currentuser.result,
                    points: updatedPoints
                }
            }));

            console.log('Points Updated:', updatedPoints);
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    useEffect(() => {
        if (currentuser) {
            handlehistory();
        }
        handleviews();

        const video = videoRef.current;
        if (video) {
            video.addEventListener('ended', handlePoints);
        }

        return () => {
            if (video) {
                video.removeEventListener('ended', handlePoints);
            }
        };
    }, [vid, currentuser, dispatch]);

    return (
        <div className="container_videoPage">
            <div className="container2_videoPage">
                <div className="video_display_screen_videoPage">
                    <video
                        src={`http://localhost:5000/${vv?.filepath}`}
                        className="video_ShowVideo_videoPage"
                        controls
                        ref={videoRef}
                    />
                    <div className="video_details_videoPage">
                        <div className="video_btns_title_VideoPage_cont">
                            <p className="video_title_VideoPage">{vv?.title}</p>
                            <div className="views_date_btns_VideoPage">
                                <div className="views_videoPage">
                                    {vv?.views} views <div className="dot"></div>{" "}
                                    {moment(vv?.createdat).fromNow()}
                                </div>
                                <Likewatchlatersavebtns vv={vv} vid={vid} />
                            </div>
                        </div>
                        <Link to={'/'} className='chanel_details_videoPage'>
                            <b className="chanel_logo_videoPage">
                                <p>{vv?.uploader.charAt(0).toUpperCase()}</p>
                            </b>
                            <p className="chanel_name_videoPage">{vv.uploader}</p>
                        </Link>
                        <div className="comments_VideoPage">
                            <h2>
                                <u>Comments</u>
                            </h2>
                            <Comment videoid={vv._id} />
                        </div>
                    </div>
                </div>
                <div className="moreVideoBar">More videos</div>
            </div>
        </div>
    );
};

export default Videopage;
