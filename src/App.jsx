import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [records, setRecords] = useState([]);
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  //calculating length of data
  const total = employees.length;
  //calculating number of pages
  const numberOfPages = Math.ceil(total / limit);
  //creating array of number of pages to loop through it
  const nPages = [...Array(numberOfPages + 1).keys()].slice(1);

  function LoadEmployees() {
    //loading users for getting length
    axios.get(`https://dummyjson.com/user`)
    .then((response) => {
      setEmployees(response.data.users);
    });

    //loading users according to given limit and skip
    axios.get(`https://dummyjson.com/user?limit=${limit}&skip=${skip}`)
    .then((response) => {
      setRecords(response.data.users);
    });
  }

  //sorting data in ascending order by id
  function handleAscOrderById() {
    let data = [...records].sort((a, b) => a.id - b.id);
    setRecords(data);
  }

  //sorting data in descending order by id
  function handleDscOrderById() {
    let data = [...records].sort((a, b) => b.id - a.id);
    setRecords(data);
  }

  //sorting data in ascending order by name
  function handleAscOrderByName() {
    let data = [...records].sort((a, b) => a.firstName.localeCompare(b.firstName));
    setRecords(data);
  }

  //sorting data in descending order by name
  function handleDscOrderByName() {
    let data = [...records].sort((a, b) => b.firstName.localeCompare(a.firstName));
    setRecords(data);
  }
  //sorting data in ascending order by age
  function handleAscOrderByAge() {
    let data = [...records].sort((a, b) => a.age - b.age);
    setRecords(data);
  }

  //sorting data in descending order by age
  function handleDscOrderByAge() {
    let data = [...records].sort((a, b) => b.age - a.age);
    setRecords(data);
  }

  //logic for getting previous page in pagination
  function prev() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSkip(skip - limit);
    }
  }

  //logic for getting current page in pagination
  function changeCPage(n) {
    setCurrentPage(n);
    setSkip((n - 1) * limit);
  }

  //logic for getting next page in pagination
  function next() {
    if (currentPage < numberOfPages) {
      setCurrentPage(currentPage + 1);
      setSkip(skip + limit);
    }
  }

  //filtering records for selected gender or for selected country
  const filterRecords = records.filter((e) => (e.gender === selectedGender) || (e.address?.country === selectedCountry));

  //loading employees/users
  useEffect(() => {
    LoadEmployees();
  }, [skip]);

  return (
    <div className="container">
      <div className="d-flex justify-content-between mt-5 mb-5">
        <div className="h3 fw-bold">Employees</div>
        <div className="d-flex">
          <div className="pt-2">
            <i className="bi bi-funnel-fill h5 me-3 text-danger"></i>
          </div>
          {/* dropdown for country */}
          <select className="border-secondary-subtle btn me-3" value={selectedCountry} onChange={(e)=> setSelectedCountry(e.target.value)}>
            <option value='all'>Country</option>
            <option value='United States'>USA</option>
            <option value='Australia'>AUS</option>
          </select>
          {/* dropdown for gender */}
          <select className="border-secondary-subtle btn" value={selectedGender} onChange={(e)=> setSelectedGender(e.target.value)}>
            <option value='all'>Gender</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
        </div>
      </div>
      {/* table to display data */}
      <table className="table table-hover table-responsive">
        <thead>
          <tr>
            <th>ID
              <i className="bi bi-arrow-up btn p-0 text-danger" onClick={handleAscOrderById}></i>
              <i className="bi bi-arrow-down btn p-0 text-danger" onClick={handleDscOrderById}></i>
            </th>
            <th>Image</th>
            <th>Full Name
              <i className="bi bi-arrow-up btn p-0 text-danger" onClick={handleAscOrderByName}></i>
              <i className="bi bi-arrow-down btn p-0 text-danger" onClick={handleDscOrderByName}></i>
            </th>
            <th>Demography
              <i className="bi bi-arrow-up btn p-0 text-danger" onClick={handleAscOrderByAge}></i>
              <i className="bi bi-arrow-down btn p-0 text-danger" onClick={handleDscOrderByAge}></i>
            </th>
            <th>Designation</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {
            (selectedGender === '' || selectedGender === 'all') && (selectedCountry === '' || selectedCountry === 'all') ?
              records.length > 0 ? 
              records.map(employee =>
                <tr key={employee.id}>
                  <td>{employee.id < 10 ? '0' + employee.id : employee.id}</td>
                  <td><img src={employee.image} width="50" height="50" alt='' /></td>
                  <td>{employee.firstName} {employee.maidenName} {employee.lastName}</td>
                  <td>{employee.gender === 'female' ? 'F' : 'M'}/{employee.age}</td>
                  <td>{employee.company?.title}</td>
                  <td>{employee.address?.state}, {employee.address?.country === 'United States' ? 'USA' : employee.address?.country}</td>
                </tr>
              )
              :
              <div>
                  <h4 className='fw-bold'>No Record Found!</h4>
              </div>
            :
            filterRecords.length > 0 ? filterRecords.map(employee =>
              <tr key={employee.id}>
                <td>{employee.id < 10 ? '0' + employee.id : employee.id}</td>
                <td><img src={employee.image} width="50" height="50" alt='' /></td>
                <td>{employee.firstName} {employee.maidenName} {employee.lastName}</td>
                <td>{employee.gender === 'female' ? 'F' : 'M'}/{employee.age}</td>
                <td>{employee.company?.title}</td>
                <td>{employee.address?.state}, {employee.address?.country === 'United States' ? 'USA' : employee.address?.country}</td>
              </tr>
            )
            :
            <tr>
                <h4 className='fw-bold'>No Record Found!</h4>
            </tr>
          }
        </tbody>
      </table>
      {/* pagination buttons */}
      <div className='w-25'>
        <ul className='d-flex gap-2 list-unstyled'>
          <li>
            <button className='btn border-black bg-danger text-white' onClick={prev}>Prev</button>
          </li>
          {
            nPages.map((n, i) =>
              <button key={i} className={n === currentPage ? 'btn border-black bg-danger text-white' : 'btn border-black'} onClick={() => changeCPage(n)}>
                {n}
              </button>
            )
          }
          <li>
            <button className='btn border-black bg-danger text-white' onClick={next}>Next</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
