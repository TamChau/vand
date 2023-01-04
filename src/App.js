import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisplayModal, setIsDisplayModal] = useState(false);
  const [modalData, setModalData] = useState(undefined);
  const [isModalDataLoading, setIsModalDataLoading] = useState(true);

  const handleLoadData = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.get('https://api.covid19api.com/summary');

      if (data && Array.isArray(data.Countries)) {
        const newData = data.Countries.sort(
          (a, b) =>
            b.TotalConfirmed - a.TotalConfirmed ||
            b.TotalDeaths - a.TotalDeaths ||
            b.TotalRecovered - a.TotalRecovered
        );

        setData(newData);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      console.log('get root data error', e);
    }
  };

  useEffect(() => {
    handleLoadData();
  }, []);

  const handleCountryClick = async (id) => {
    try {
      setIsModalDataLoading(true);

      const { data } = await axios.get(
        `https://restcountries.com/v3.1/alpha/${id}`
      );
      console.log('data', data);
      // if (Array.isArray(data)) {
      setModalData(data[0]);
      // } else {
      //   setModalData(data);
      // }

      setIsModalDataLoading(false);
    } catch (e) {
      setIsModalDataLoading(false);
      console.log('get country data error', e);
    }
  };

  const openModal = () => {
    setIsDisplayModal(true);
  };

  const closeModal = () => {
    setIsDisplayModal(false);
    setModalData(undefined);
  };

  return (
    <div className='App'>
      <h1>VAND FE appilication test</h1>
      <h3 className='title'>Countries most affected by Covid-19</h3>
      {isLoading ? (
        <div className='ellipsis'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <div className='data'>
          <div className='wrapper'>
            <div className='country-name'>Country</div>
            <div className='total-confirmed'>Total confirmed case</div>
            <div className='total-death'>Total death case</div>
            <div className='total-recovered'>Total recovered case</div>
          </div>

          {data.length ? (
            data.map((country) => {
              return (
                <div
                  className='wrapper'
                  key={country.ID}
                  onClick={() => {
                    openModal();
                    handleCountryClick(country.CountryCode);
                  }}
                >
                  <div className='country-name'>{country.Country}</div>
                  <div className='total-confirmed'>
                    {country.TotalConfirmed.toLocaleString()}
                  </div>
                  <div className='total-death'>
                    {country.TotalDeaths.toLocaleString()}
                  </div>
                  <div className='total-recovered'>
                    {country.TotalRecovered.toLocaleString()}
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      )}

      {isDisplayModal && <div className='overlay' />}
      <div
        className={`modal-wrapper ${isDisplayModal ? 'show' : 'hide'}`}
        onClick={closeModal}
      >
        <div className='modal'>
          <div className='close-button' onClick={closeModal}>
            X
          </div>
          {isModalDataLoading ? (
            <div className='ellipsis'>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : modalData ? (
            <>
              <div className='country-info'>
                <h3>{modalData?.name?.official || ''}</h3>
                <div className='flag'>
                  <img src={modalData?.flags.png} alt='flag' />
                </div>
              </div>
              <div className='detail'>
                <div>
                  <b>Population:</b>{' '}
                  {modalData?.population.toLocaleString() || ''}
                </div>
                <div>
                  <b>Capital:</b>{' '}
                  {modalData?.capital?.[0] || modalData?.capital || ''}
                </div>
              </div>
              <div className='detail'>
                <div>
                  <b>Region:</b> {modalData?.region || ''}
                </div>
                <div>
                  <b>Subregion:</b> {modalData?.subregion || ''}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
