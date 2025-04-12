import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicVideoService, getVideoStreamUrl } from '../services/video.service';
import { Video } from '../types/video.types';
import './WatchMovie.css';
import { Container, Typography } from '@mui/material';

const WatchMovie: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [error, setError] = useState<string | null>(null);
    const [video, setVideo] = useState<Video | null>(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const { data } = await publicVideoService.getVideoById(id!);
                setVideo(data);
            } catch (err) {
                setError('Video bilgileri alınamadı');
                console.error('Video bilgileri alınamadı:', err);
            }
        };

        fetchVideo();
    }, [id]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    const handleVideoError = () => {
        setError('Video yüklenirken bir hata oluştu');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {
                video && 
                    <>
                        <video
                            controls
                            className="centered-video"
                            onError={handleVideoError} // Hata yönetimi eklendi
                            preload="auto" // Önceden yükleme eklendi
                            playsInline
                        >
                            <source src={getVideoStreamUrl(video?.id || '')}
                                type={video?.contentType}
                            />
                        </video>
                        <Typography variant="h6" className="video-title">
                            {video.title}
                        </Typography>
                    </>
            }
        </Container>
    );
};

export default WatchMovie; 