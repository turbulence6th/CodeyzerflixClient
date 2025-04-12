import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

const Navbar = () => {
  const theme = useTheme();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleInputExpand = () => {
    setIsInputExpanded(true); // Butona tıklandığında input'u büyüt
  };

  const handleInputBlur = () => {
    setIsInputExpanded(false); // Odak kaybolduğunda input'u küçült
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar
        sx={{
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start',
          justifyContent: isMobile ? 'center' : 'space-between',
          gap: isMobile ? 2 : 0,
          py: 2,
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            textDecoration: 'none',
            textAlign: 'center',
            mb: isMobile ? 1 : 0,
          }}
        >
          CodeyzerFlix
        </Typography>

        {/* Arama Kutusu + Ara Butonu */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            width: isMobile ? '100%' : 'auto',
            maxWidth: '500px',
            px: isMobile ? 2 : 0,
            flexGrow: isMobile ? 0 : 1,
            mr: isMobile ? 0 : 3,
          }}
        >
          <TextField
            fullWidth={isMobile}
            variant="outlined"
            size="small"
            placeholder="Ara..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleInputExpand}
            onBlur={handleInputBlur}
            sx={{
              width: isMobile ? '100%' : isInputExpanded ? '450px' : '300px',
              transition: 'width 0.3s ease',
            }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Ara
          </Button>
        </Box>

        {/* Button Group */}
        <ButtonGroup
          variant="outlined"
          orientation="horizontal"
          sx={{
            mt: isMobile ? 2 : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          aria-label="Basic button group"
        >
          <Button onClick={() => navigate(`/search?videoType=SUNGER_BOB`)}>
            Sünger Bob
          </Button>
          <Button onClick={() => navigate(`/search?videoType=CILGIN_KORSAN_JACK`)}>
            Çılgın Korsan Jack
          </Button>
        </ButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 