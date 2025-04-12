import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  TextField,
  Toolbar,
  Typography,
  useTheme
} from '@mui/material';

const Navbar = () => {
  const theme = useTheme();
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchKeyword) {
      navigate(`/search?keyword=${searchKeyword}`); // Arama sayfasına yönlendirme
      setSearchKeyword('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(); // Enter tuşuna basıldığında arama yap
    }
  };

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            CodeyzerFlix
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'left' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Ara..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown} // Enter tuşu için olay eklendi
              sx={{ mr: 1 }} // Sağda biraz boşluk bırak
            />
            <Button variant="contained" onClick={handleSearch}>
              Ara
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar; 