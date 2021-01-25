import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [cities, setCities] = useState([]);
  const [showOptions, setShowOptions] = useState(false)
  const [loading, setLoading] = useState(true);
  
  const handleChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setSearchValue(value);
    const tempCitites = isStringIncludes(value, cities)
    setCities(tempCitites)
  }

  const onListClick = (e) => {
    const data = e.target.innerHTML
    setSearchValue(data)
  }

  const handleClick = () => {
    setShowOptions(prev => !prev);
  }

  const inputData = {
    name: 'randomSearch',
    value: searchValue,
    onChange: handleChange,
    onClick: handleClick,
    placeholder: 'From',
   // id:'city'
  }

  

  useEffect(() => {
    const getRequiredData = async () => {
      try{ 
      const config = {
        method: 'get',
        url: 'https://voyager.goibibo.com/api/v2/flights_search/find_node_by_name_v2/?limit=15&search_query=india&v=2',
        headers: { }
      };

      const response = await axios(config);
      const data = responseHandler(response)
      setCities(data)
      setLoading(false);
    } catch {
      console.error('error');
      setLoading(false);
    }
    }

    getRequiredData();
  }, []);


  if(loading) {
    return (<div> Loading...</div>)
  }

  return (
    <div className="App">
    <span className='appendToBottom' aria-autocomplete='false'></span>
    {/* <label for='city'></label> */}
    <input {...inputData}/>  
    
    {showOptions && <ul name="cars" id="cars">
      {cities.map(item =>  item.show && <li onClick={onListClick}>{item.label}</li>)}
    </ul>}
    
    </div>
  );
}

export default App;



function responseHandler (response) {
  const { data }  =  response.data || {};
  const list = data.r.map(item => ({label:item.n, show: true}))
  return list;
}

function errorHandler(error) {
  console.error(error);
}

function isStringIncludes(value, arr ) {
  const stringsArr = arr.map(item => {
    return {
    label: item.label, 
    show: value == ''? true: item && item.label.toLowerCase().includes(value.toLowerCase()) 
  }}
  );
  return stringsArr;
}