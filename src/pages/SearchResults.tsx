
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';

import { VideoType } from '../types/video.types';
import VideoList from '../components/VideoList';
import { useEffect, useState } from 'react';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [keyword, setKeyword] = useState(new URLSearchParams(location.search).get('keyword') || '');
  const [videoType, setVideoType] = useState(new URLSearchParams(location.search).get('videoType') || '');

  // URL'den keyword değiştiğinde state'i güncelle
  useEffect(() => {
    setKeyword(new URLSearchParams(location.search).get('keyword') || '');
    setVideoType(new URLSearchParams(location.search).get('videoType') || '');
  }, [location.search]);

  // Arama alanı değiştiğinde URL'yi güncelle
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    const params = new URLSearchParams(location.search);
    params.set('keyword', newKeyword);
    navigate({ search: params.toString() }); 
  };

  const handleVideoTypeChange = (e: SelectChangeEvent<string>) => { // Parametre türü değiştirildi
    const newVideoType = e.target.value;
    setVideoType(newVideoType);
    const params = new URLSearchParams(location.search);
    params.set('videoType', newVideoType);
    navigate({ search: params.toString() });
  };


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <TextField
        label="Anahtar Kelime"
        variant="outlined"
        fullWidth
        value={keyword}
        onChange={handleKeywordChange}
      />
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Video Türü</InputLabel>
        <Select
          value={videoType}
          onChange={handleVideoTypeChange}
          label="Video Türü"

        >
          <MenuItem value="SUNGER_BOB">Sünger Bob</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
            Arama Sonuçları: 
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <VideoList details={{ keyword, videoType: videoType as VideoType }} />
      </Box>
    </Container>
  );
};

export default SearchResults;