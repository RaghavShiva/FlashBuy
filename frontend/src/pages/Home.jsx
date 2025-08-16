import { useEffect, useState } from 'react';
import { Box, Container, styled } from '@mui/material';
import Slide from './Slide';
import Banner from './Banner';
import { useDispatch, useSelector } from 'react-redux';
import ProductsMenu from './customer/components/ProductsMenu';
import { NewtonsCradle } from '@uiball/loaders';
import { Link } from 'react-router-dom';
import ad from '../assets/adimg.gif';
import ad3 from '../assets/adimg3.gif'
import ad2 from '../assets/adimg2.jpg'
import './Home.css'

const Home = () => {
  const dispatch = useDispatch();
  const { productData, responseProducts, error } = useSelector((state) => state.user);

  const [showNetworkError, setShowNetworkError] = useState(false);

  useEffect(() => {
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setShowNetworkError(true);
      }, 40000);

      return () => clearTimeout(timeoutId);
    }
  }, [error]);


  return (
    <div id="top">
      <Container
        sx={{
          display: 'none',
          '@media (max-width: 600px)': {
            display: 'flex',
          },
        }}
      >
        <ProductsMenu dropName="Categories" />
        <ProductsMenu dropName="Products" />
      </Container>
      <BannerBox>
        <Banner />
      </BannerBox>

      {showNetworkError ? (
        <StyledContainer>
          <h1>Sorry, network error.</h1>
        </StyledContainer>
      ) : error ? (
        <StyledContainer>
          <h1>Please Wait A Second</h1>
          <NewtonsCradle size={70} speed={1.4} color="black" />
        </StyledContainer>
      ) : (
        <>
          {responseProducts ? (
            <>
              <StyledContainer>No products found right now</StyledContainer>
              <StyledContainer>
                Become a seller to add products
                <Link to={"/Sellerregister"}>
                  Join
                </Link>
              </StyledContainer>
            </>
          ) : (
            <>
              <Component>
                <LeftComponent>
                  <Slide products={productData} title="Top Selection" />
                </LeftComponent>
                <RightComponent>
                  <img src={ad} alt="AD" />
                </RightComponent>
              </Component>
              <Component>
                <LeftComponent>
                  <Slide products={productData} title="Deals of the Day" />
                </LeftComponent>
                <RightComponent>
                  <img src={ad2} alt="AD" />
                </RightComponent>
              </Component>
              <Component>
                <LeftComponent>
                  <Slide products={productData} title="Discounts for You" />
                </LeftComponent>
                <RightComponent>
                  <img src={ad3} alt="AD" />
                </RightComponent>
              </Component>
              <Slide products={productData} title="Suggested Items" />
              <Slide products={productData} title="Recommended Items" />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

const BannerBox = styled(Box)`
  padding: 20px 10px;
  background: #F2F2F2;
`;

const Component = styled(Box)`
  display: flex;
`;

const LeftComponent = styled(Box)(({ theme }) => ({
  width: '83%',
  [theme.breakpoints.down('md')]: {
    width: '70%',
  },
}));

const RightComponent = styled(Box)(({ theme }) => ({
  marginTop: 20,
  background: '#FFFFFF',
  width: '17%',
  padding: 2,
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    width: '30%',
  },
}));
