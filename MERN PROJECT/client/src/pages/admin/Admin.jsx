import React, { useEffect, useState } from 'react';
import '../../styles/Admin.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [banner, setBanner] = useState('');

  useEffect(() => {
    if (localStorage.getItem('userType') !== 'admin') {
      navigate('/');
    } else {
      fetchCountData();
    }
  }, []);

  const fetchCountData = async () => {
    try {
      const usersResponse = await axios.get('http://localhost:6001/fetch-users');
      setUserCount(usersResponse.data.length - 1);

      const productsResponse = await axios.get('http://localhost:6001/fetch-products');
      setProductCount(productsResponse.data.length);

      const ordersResponse = await axios.get('http://localhost:6001/fetch-orders');
      setOrdersCount(ordersResponse.data.length);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const updateBanner = async () => {
    try {
      await axios.post('http://localhost:6001/update-banner', { banner });
      alert('Banner updated');
      setBanner('');
    } catch (error) {
      console.error("Error updating banner", error);
    }
  };

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      
      <div className="admin-cards">
        <div className="admin-home-card">
          <h5>Total Users</h5>
          <p>{userCount}</p>
          <button onClick={() => navigate('/all-users')}>View Users</button>
        </div>

        <div className="admin-home-card">
          <h5>Total Products</h5>
          <p>{productCount}</p>
          <button onClick={() => navigate('/all-products')}>View Products</button>
        </div>

        <div className="admin-home-card">
          <h5>Total Orders</h5>
          <p>{ordersCount}</p>
          <button onClick={() => navigate('/all-orders')}>View Orders</button>
        </div>

        <div className="admin-home-card add-product-card">
          <h5>Add New Product</h5>
          <button onClick={() => navigate('/new-product')}>Add Product</button>
        </div>

        <div className="admin-banner-input admin-home-card">
          <h5>Update Banner</h5>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingURLInput"
              placeholder="Enter banner URL"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
            />
            <label htmlFor="floatingURLInput">Banner URL</label>
          </div>
          <button onClick={updateBanner}>Update Banner</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
.admin-page {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.admin-home-card {
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  text-align: center;
}

.admin-home-card h5 {
  font-size: 16px;
  margin-bottom: 10px;
}

.admin-home-card p {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}


ALLORDERS.JSX

import React, { useEffect, useState } from 'react';
import '../../styles/AllOrders.css';
import axios from 'axios';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-orders');
      setOrders(response.data.reverse());
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const cancelOrder = async (id) => {
    try {
      await axios.put('http://localhost:6001/cancel-order', { id });
      alert('Order cancelled!');
      fetchOrders();
    } catch (error) {
      alert('Order cancellation failed!');
    }
  };

  const updateOrderStatus = async (id) => {
    try {
      await axios.put('http://localhost:6001/update-order-status', { id, updateStatus });
      alert('Order status updated!');
      setUpdateStatus('');
      fetchOrders();
    } catch (error) {
      alert('Order update failed!');
    }
  };

  return (
    <div className="all-orders-page">
      <h3>All Orders</h3>

      <div className="all-orders-container">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <img src={order.mainImg} alt={order.title} className="order-image" />

            <div className="order-details">
              <h4>{order.title}</h4>
              <p>{order.description}</p>

              <div className="order-info">
                <span><strong>Size:</strong> {order.size}</span>
                <span><strong>Quantity:</strong> {order.quantity}</span>
                <span><strong>Price:</strong> ₹{parseInt(order.price - (order.price * order.discount) / 100) * order.quantity}</span>
                <span><strong>Payment Method:</strong> {order.paymentMethod}</span>
              </div>

              <div className="user-info">
                <span><strong>User ID:</strong> {order.userId}</span>
                <span><strong>Name:</strong> {order.name}</span>
                <span><strong>Email:</strong> {order.email}</span>
                <span><strong>Mobile:</strong> {order.mobile}</span>
              </div>

              <div className="shipping-info">
                <span><strong>Ordered on:</strong> {order.orderDate.slice(0, 10)}</span>
                <span><strong>Address:</strong> {order.address}</span>
                <span><strong>Pincode:</strong> {order.pincode}</span>
              </div>

              <div className="order-actions">
                <span><strong>Order Status:</strong> {order.orderStatus}</span>

                {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                  <div className="status-update">
                    <select
                      className="form-select form-select-sm"
                      id="statusSelect"
                      defaultValue=""
                      onChange={(e) => setUpdateStatus(e.target.value)}
                    >
                      <option value="" disabled>Update Status</option>
                      <option value="Order placed">Order Placed</option>
                      <option value="In-transit">In-transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <button className="btn-update" onClick={() => updateOrderStatus(order._id)}>Update</button>
                  </div>
                )}

                {['order placed', 'In-transit'].includes(order.orderStatus) && (
                  <button className="btn-cancel" onClick={() => cancelOrder(order._id)}>Cancel</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrders;


.all-orders-page {
  padding: 20px;
  max-width: 1000px;
  margin: auto;
}

h3 {
  text-align: center;
  margin-bottom: 20px;
}

.all-orders-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.order-card {
  display: flex;
  flex-direction: row;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 15px;
}

.order-image {
  width: 150px;
  height: auto;
  margin-right: 15px;
  border-radius: 4px;
}

.order-details {
  flex: 1;
}

.order-info, .user-info, .shipping-info, .order-actions {
  margin-top: 10px;
}

.order-info span, .user-info span, .shipping-info span {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
}

.status-update {
  display: flex;
  align-items: center;
}

#statusSelect {
  margin-right: 10px;
}

.btn-update, .btn-cancel {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-update {
  background-color: #007bff;
  color: white;
  margin-right: 10px;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
}

.btn-update:hover {
  background-color: #0056b3;
}

.btn-cancel:hover {
  background-color: #c82333;
}
 

ALLPRODUCTS.JSX
import React, { useEffect, useState } from 'react';
import '../../styles/AllProducts.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [sortFilter, setSortFilter] = useState('popularity');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [genderFilter, setGenderFilter] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const productResponse = await axios.get('http://localhost:6001/fetch-products');
            const categoryResponse = await axios.get('http://localhost:6001/fetch-categories');
            setProducts(productResponse.data);
            setVisibleProducts(productResponse.data);
            setCategories(categoryResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCategoryCheckBox = (e) => {
        const value = e.target.value;
        setCategoryFilter((prev) =>
            e.target.checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };

    const handleGenderCheckBox = (e) => {
        const value = e.target.value;
        setGenderFilter((prev) =>
            e.target.checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };

    const handleSortFilterChange = (e) => {
        const value = e.target.value;
        setSortFilter(value);
        let sortedProducts = [...visibleProducts];

        if (value === 'low-price') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (value === 'high-price') {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (value === 'discount') {
            sortedProducts.sort((a, b) => b.discount - a.discount);
        }
        setVisibleProducts(sortedProducts);
    };

    useEffect(() => {
        let filteredProducts = products;

        if (categoryFilter.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                categoryFilter.includes(product.category)
            );
        }
        if (genderFilter.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                genderFilter.includes(product.gender)
            );
        }
        setVisibleProducts(filteredProducts);
    }, [categoryFilter, genderFilter, products]);

    return (
        <div className="all-products-page">
            <div className="all-products-container">
                <div className="all-products-filter">
                    <h4>Filters</h4>
                    <div className="all-product-filters-body">

                        <div className="all-product-filter-sort">
                            <h6>Sort By</h6>
                            <div className="all-product-filter-sort-body all-product-sub-filter-body">
                                {['popularity', 'low-price', 'high-price', 'discount'].map((filter, index) => (
                                    <div className="form-check" key={filter}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="sortFilter"
                                            id={`filter-sort-radio${index + 1}`}
                                            value={filter}
                                            checked={sortFilter === filter}
                                            onChange={handleSortFilterChange}
                                        />
                                        <label className="form-check-label" htmlFor={`filter-sort-radio${index + 1}`}>
                                            {filter === 'low-price' ? 'Price (low to high)' : filter === 'high-price' ? 'Price (high to low)' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="all-product-filter-categories">
                            <h6>Categories</h6>
                            <div className="all-product-filter-categories-body all-product-sub-filter-body">
                                {categories.map((category) => (
                                    <div className="form-check" key={category}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={category}
                                            id={`productCategory${category}`}
                                            checked={categoryFilter.includes(category)}
                                            onChange={handleCategoryCheckBox}
                                        />
                                        <label className="form-check-label" htmlFor={`productCategory${category}`}>
                                            {category}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="all-product-filter-gender">
                            <h6>Gender</h6>
                            <div className="all-product-filter-gender-body all-product-sub-filter-body">
                                {['Men', 'Women', 'Unisex'].map((gender, index) => (
                                    <div className="form-check" key={gender}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={gender}
                                            id={`filter-gender-check-${index + 1}`}
                                            checked={genderFilter.includes(gender)}
                                            onChange={handleGenderCheckBox}
                                        />
                                        <label className="form-check-label" htmlFor={`filter-gender-check-${index + 1}`}>
                                            {gender}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="all-products-body">
                    <h3>All Products</h3>
                    <div className="all-products">
                        {visibleProducts.map((product) => (
                            <div className="all-product-item" key={product._id}>
                                <div className="all-product">
                                    <img src={product.mainImg} alt={product.title} />
                                    <div className="all-product-data">
                                        <h6>{product.title}</h6>
                                        <p>{product.description.slice(0, 30) + '....'}</p>
                                        <h5>
                                            ₹{parseInt(product.price - (product.price * product.discount) / 100)}{' '}
                                            <s>{product.price}</s>
                                            <span> ({product.discount}% off)</span>
                                        </h5>
                                    </div>
                                    <button onClick={() => navigate(`/update-product/${product._id}`)}>Update</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;

.all-products-page {
  padding: 20px;
  max-width: 1000px;
  margin: auto;
}

.all-products-container {
  display: flex;
  gap: 20px;
}

.all-products-filter {
  flex: 0.3;
  border: 1px solid #e0e0e0;
  padding: 10px;
  border-radius: 8px;
}

.all-product-filters-body h6 {
  margin-bottom: 10px;
}

.form-check {
  margin-bottom: 8px;
}

.all-products-body {
  flex: 0.7;
}

.all-product-item {
  border: 1px solid #e0e0e0;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.all-product-data {
  flex-grow: 1;
}

button {
  padding: 5px 15px;
  border: none;
  color: #fff;
  background-color: #007bff;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}


ALLUSERS.JSX
import React, { useEffect, useState } from 'react';
import '../../styles/AllUsers.css';
import axios from 'axios';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchUsersData();
    }, []);

    const fetchUsersData = async () => {
        try {
            const userResponse = await axios.get('http://localhost:6001/fetch-users');
            const orderResponse = await axios.get('http://localhost:6001/fetch-orders');
            setUsers(userResponse.data.filter((user) => user.usertype === 'customer'));
            setOrders(orderResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="all-users-page">
            <h3>All Users</h3>
            <div className="user-cards">
                {users.map((user) => (
                    <div className="user-card" key={user._id}>
                        <span>
                            <h5>User Id</h5>
                            <p>{user._id}</p>
                        </span>
                        <span>
                            <h5>User Name</h5>
                            <p>{user.username}</p>
                        </span>
                        <span>
                            <h5>Email Address</h5>
                            <p>{user.email}</p>
                        </span>
                        <span>
                            <h5>Orders</h5>
                            <p>{orders.filter((order) => order.userId === user._id).length}</p>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllUsers;

.all-users-page {
    padding: 20px;
    background-color: #f9f9f9;
}

.all-users-page h3 {
    font-size: 24px;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
}

.user-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.user-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 15px;
    width: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.3s ease;
}

.user-card:hover {
    transform: translateY(-5px);
}

.user-card span {
    width: 100%;
    margin-bottom: 10px;
}

.user-card h5 {
    font-size: 14px;
    color: #555;
    margin: 0;
}

.user-card p {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 4px 0 0;
}


NEWPRODUCT.JSX
import React, { useEffect, useState } from 'react'
import '../../styles/NewProducts.css'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const NewProduct = () => {
 
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productMainImg, setProductMainImg] = useState('');
  const [productCarouselImg1, setProductCarouselImg1] = useState('');
  const [productCarouselImg2, setProductCarouselImg2] = useState('');
  const [productCarouselImg3, setProductCarouselImg3] = useState('');
  const [productSizes, setProductSizes] = useState([]);
  const [productGender, setProductGender] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productNewCategory, setProductNewCategory] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);


  const [AvailableCategories, setAvailableCategories] = useState([]);


  useEffect(()=>{
    fetchCategories();
  },[])
  const fetchCategories = async () =>{
    await axios.get('http://localhost:6001/fetch-categories').then(
      (response)=>{
        setAvailableCategories(response.data);
      }
    )
  }


  const handleCheckBox = (e) =>{
    const value = e.target.value;
    if(e.target.checked){
        setProductSizes([...productSizes, value]);
    }else{
        setProductSizes(productSizes.filter(size=> size !== value));
    }
  }

  const navigate = useNavigate();


  const handleNewProduct = async() =>{
    await axios.post('http://localhost:6001/add-new-product', {productName, productDescription, productMainImg, productCarousel: [productCarouselImg1, productCarouselImg2, productCarouselImg3], productSizes, productGender, productCategory, productNewCategory, productPrice, productDiscount}).then(
      (response)=>{
        alert("product added");
        setProductName('');
        setProductDescription('');
        setProductMainImg('');
        setProductCarouselImg1('');
        setProductCarouselImg2('');
        setProductCarouselImg3('');
        setProductSizes([]);
        setProductGender('');
        setProductCategory('');
        setProductNewCategory('');
        setProductPrice(0);
        setProductDiscount(0);

        navigate('/all-products');
      }
    )
  }


  return (
    <div className="new-product-page">
        <div className="new-product-container">
          <h3>New Product</h3>

          <div className="new-product-body">

            <span>
              <div className="form-floating mb-3 span-21">
                <input type="text" className="form-control" id="floatingNewProduct1" value={productName} onChange={(e)=>setProductName(e.target.value)} />
                <label htmlFor="floatingNewProduct1">Product name</label>
              </div>
              <div className="form-floating mb-3 span-22">
                <input type="text" className="form-control" id="floatingNewProduct2" value={productDescription} onChange={(e)=>setProductDescription(e.target.value)} />
                <label htmlFor="floatingNewProduct2">Product Description</label>
              </div>
            </span>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="floatingNewProduct1" value={productMainImg} onChange={(e)=>setProductMainImg(e.target.value)}/>
              <label htmlFor="floatingNewProduct1">Thumbnail Img url</label>
            </div>

            <span>
              <div className="form-floating mb-3 span-3">
                <input type="text" className="form-control" id="floatingNewProduct2" value={productCarouselImg1} onChange={(e)=>setProductCarouselImg1(e.target.value)}/>
                <label htmlFor="floatingNewProduct2">Add on img1 url</label>
              </div>
              <div className="form-floating mb-3 span-3">
                <input type="text" className="form-control" id="floatingNewProduct2" value={productCarouselImg2} onChange={(e)=>setProductCarouselImg2(e.target.value)}/>
                <label htmlFor="floatingNewProduct2">Add on img2 url</label>
              </div>
              <div className="form-floating mb-3 span-3">
                <input type="text" className="form-control" id="floatingNewProduct2" value={productCarouselImg3} onChange={(e)=>setProductCarouselImg3(e.target.value)} />
                <label htmlFor="floatingNewProduct2">Add on img3 url</label>
              </div>
            </span>

            <section>
              <h4>Available Size</h4>

              <span>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="S" checked={productSizes.includes('S')} onChange={handleCheckBox} id="flexCheckDefault" />
                  <label className="form-check-label" htmlFor="flexCheckDefault">
                    S
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="M" checked={productSizes.includes('M')} onChange={handleCheckBox} id="flexCheckChecked" />
                  <label className="form-check-label" htmlFor="flexCheckChecked">
                    M
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="L" checked={productSizes.includes('L')} onChange={handleCheckBox} id="flexCheckDefault" />
                  <label className="form-check-label" htmlFor="flexCheckDefault">
                    L
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="XL" checked={productSizes.includes('XL')} onChange={handleCheckBox} id="flexCheckChecked" />
                  <label className="form-check-label" htmlFor="flexCheckChecked">
                    XL
                  </label>
                </div>
              </span>
            </section>

            <section>
              <h4>Gender</h4>
              <span>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="productGender" value="Men" id="flexRadioDefault1" onChange={(e)=> setProductGender(e.target.value)} />
                  <label className="form-check-label" htmlFor="flexRadioDefault1">
                    Men
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="productGender" value="Women" id="flexRadioDefault2" onChange={(e)=> setProductGender(e.target.value)}/>
                  <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Women
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="productGender" value="Unisex" id="flexRadioDefault2" onChange={(e)=> setProductGender(e.target.value)}/>
                  <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Unisex
                  </label>
                </div>
              </span>
            </section>


            <span>
              <div className="form-floating mb-3 span-3">
                <select className="form-select" id='floatingNewProduct5' aria-label="Default select example" value={productCategory} onChange={(e)=>setProductCategory(e.target.value)}>
                  <option value="">Choose Product category</option>
                  {AvailableCategories.map((category)=>{
                    return(
                        <option value={category}>{category}</option>
                    )
                  })}
                  <option value="new category">New category</option>
                </select>
                <label htmlFor="floatingNewProduct5">Category</label>
              </div>
              <div className="form-floating mb-3 span-3">
                <input type="number" className="form-control" id="floatingNewProduct6" value={productPrice} onChange={(e)=>setProductPrice(e.target.value)}/>
                <label htmlFor="floatingNewProduct6">Price</label>
              </div>
              <div className="form-floating mb-3 span-3">
                <input type="number" className="form-control" id="floatingNewProduct7" value={productDiscount} onChange={(e)=>setProductDiscount(e.target.value)}/>
                <label htmlFor="floatingNewProduct7">Discount (in %)</label>
              </div>
            </span>

            {productCategory === 'new category' ?
               <div className="form-floating mb-3">
               <input type="text" className="form-control" id="floatingNewProduct8" value={productNewCategory} onChange={(e)=>setProductNewCategory(e.target.value)}/>
               <label htmlFor="floatingNewProduct8">New Category</label>
           </div>
            :
                  ""
            }
           

          </div>

          <button className='btn btn-primary' onClick={handleNewProduct}>Add product</button>
        </div>
    </div>
  )
}

export default NewProduct

.new-product-page {
    padding: 20px;
    background-color: #f9f9f9;
}

.new-product-container {
    max-width: 800px;
    margin: auto;
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.new-product-container h3 {
    font-size: 24px;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
}

.new-product-body {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.new-product-body span {
    display: flex;
    gap: 10px;
}

.form-floating.mb-3 {
    flex: 1;
}

span .form-floating {
    flex: 1;
}

.new-product-body section {
    margin-top: 15px;
}

.new-product-body section h4 {
    font-size: 18px;
    color: #555;
    margin-bottom: 10px;
}

.form-check {
    margin-right: 10px;
}

.btn-primary {
    display: block;
    width: 100%;
    padding: 10px;
    font-size: 16px;
    margin-top: 20px;
    background-color: #007bff;
    border: none;
    color: #fff;
    border-radius: 5px;
    transition: background 0.3s ease;
}

.btn-primary:hover {
    background-color: #0056b3;
}


UPDATE PRODUCT.JSX
import React, { useEffect, useState } from 'react';
import '../../styles/NewProducts.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {
  const { id } = useParams();

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productMainImg, setProductMainImg] = useState('');
  const [productCarouselImg1, setProductCarouselImg1] = useState('');
  const [productCarouselImg2, setProductCarouselImg2] = useState('');
  const [productCarouselImg3, setProductCarouselImg3] = useState('');
  const [productSizes, setProductSizes] = useState([]);
  const [productGender, setProductGender] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productNewCategory, setProductNewCategory] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);

  const [AvailableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    await axios.get(`http://localhost:6001/fetch-product-details/${id}`).then(
      (response) => {
        setProductName(response.data.title);
        setProductDescription(response.data.description);
        setProductMainImg(response.data.mainImg);
        setProductCarouselImg1(response.data.carousel[0]);
        setProductCarouselImg2(response.data.carousel[1]);
        setProductCarouselImg3(response.data.carousel[2]);
        setProductSizes(response.data.sizes);
        setProductGender(response.data.gender);
        setProductCategory(response.data.category);
        setProductPrice(response.data.price);
        setProductDiscount(response.data.discount);
      }
    );
  };

  const fetchCategories = async () => {
    await axios.get('http://localhost:6001/fetch-categories').then((response) => {
      setAvailableCategories(response.data);
    });
  };

  const handleCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setProductSizes([...productSizes, value]);
    } else {
      setProductSizes(productSizes.filter((size) => size !== value));
    }
  };

  const navigate = useNavigate();

  const handleUpdateProduct = async () => {
    await axios
      .put(`http://localhost:6001/update-product/${id}`, {
        productName,
        productDescription,
        productMainImg,
        productCarousel: [productCarouselImg1, productCarouselImg2, productCarouselImg3],
        productSizes,
        productGender,
        productCategory,
        productNewCategory,
        productPrice,
        productDiscount,
      })
      .then((response) => {
        alert('product updated');
        setProductName('');
        setProductDescription('');
        setProductMainImg('');
        setProductCarouselImg1('');
        setProductCarouselImg2('');
        setProductCarouselImg3('');
        setProductSizes([]);
        setProductGender('');
        setProductCategory('');
        setProductNewCategory('');
        setProductPrice(0);
        setProductDiscount(0);

        navigate('/all-products');
      });
  };

  return (
    <div className="new-product-page">
      <div className="new-product-container">
        <h3>Update Product</h3>

        <div className="new-product-body">
          <span>
            <div className="form-floating mb-3 span-21">
              <input
                type="text"
                className="form-control"
                id="floatingNewProduct1"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <label htmlFor="floatingNewProduct1">Product name</label>
            </div>
            <div className="form-floating mb-3 span-22">
              <input
                type="text"
                className="form-control"
                id="floatingNewProduct2"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
              <label htmlFor="floatingNewProduct2">Product Description</label>
            </div>
          </span>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingNewProduct1"
              value={productMainImg}
              onChange={(e) => setProductMainImg(e.target.value)}
            />
            <label htmlFor="floatingNewProduct1">Thumbnail Img url</label>
          </div>

          <span>
            <div className="form-floating mb-3 span-3">
              <input
                type="text"
                className="form-control"
                id="floatingNewProduct2"
                value={productCarouselImg1}
                onChange={(e) => setProductCarouselImg1(e.target.value)}
              />
              <label htmlFor="floatingNewProduct2">Add on img1 url</label>
            </div>
            <div className="form-floating mb-3 span-3">
              <input
                type="text"
                className="form-control"
                id="floatingNewProduct2"
                value={productCarouselImg2}
                onChange={(e) => setProductCarouselImg2(e.target.value)}
              />
              <label htmlFor="floatingNewProduct2">Add on img2 url</label>
            </div>
            <div className="form-floating mb-3 span-3">
              <input
                type="text"
                className="form-control"
                id="floatingNewProduct2"
                value={productCarouselImg3}
                onChange={(e) => setProductCarouselImg3(e.target.value)}
              />
              <label htmlFor="floatingNewProduct2">Add on img3 url</label>
            </div>
          </span>

          <section>
            <h4>Available Size</h4>

            <span>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="S"
                  checked={productSizes.includes('S')}
                  onChange={handleCheckBox}
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  S
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="M"
                  checked={productSizes.includes('M')}
                  onChange={handleCheckBox}
                  id="flexCheckChecked"
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  M
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="L"
                  checked={productSizes.includes('L')}
                  onChange={handleCheckBox}
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  L
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="XL"
                  checked={productSizes.includes('XL')}
                  onChange={handleCheckBox}
                  id="flexCheckChecked"
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  XL
                </label>
              </div>
            </span>
          </section>

          <section>
            <h4>Gender</h4>
            <span>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="productGender"
                  value="Men"
                  checked={productGender === 'Men'}
                  id="flexRadioDefault1"
                  onChange={(e) => setProductGender(e.target.value)}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  Men
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="productGender"
                  value="Women"
                  checked={productGender === 'Women'}
                  id="flexRadioDefault2"
                  onChange={(e) => setProductGender(e.target.value)}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  Women
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="productGender"
                  value="Unisex"
                  checked={productGender === 'Unisex'}
                  id="flexRadioDefault2"
                  onChange={(e) => setProductGender(e.target.value)}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  Unisex
                </label>
              </div>
            </span>
          </section>

          <span>
            <div className="form-floating mb-3 span-3">
              <select
                className="form-select"
                id="floatingNewProduct5"
                aria-label="Default select example"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              >
                <option value="">Choose Product category</option>
                {AvailableCategories.map((category) => {
                  return <option value={category}>{category}</option>;
                })}
                <option value="new category">New category</option>
              </select>
              <label htmlFor="floatingNewProduct5">Category</label>
            </div>
            <div className="form-floating mb-3 span-3">
              <input
                type="number"
                className="form-control"
                id="floatingNewProduct6"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
              <label htmlFor="floatingNewProduct6">Price</label>
            </div>
            <div className="form-floating mb-3 span-3">
              <input
                type="number"
                className="form-control"
                id="floatingNewProduct7"
                value={productDiscount}
                onChange={(e) => setProductDiscount(e.target.value)}
              />
              <label htmlFor="floatingNewProduct7">Discount (in %)</label>
            </div>
          </span>

          {productCategory === 'new category' ? (
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingNewProduct8"
                value={productNewCategory}
                onChange={(e) => setProductNewCategory(e.target.value)}
              />
              <label htmlFor="floatingNewProduct8">New Category</label>
            </div>
          ) : (
            ''
          )}
        </div>

        <button className="btn btn-primary" onClick={handleUpdateProduct}>
          Update
        </button>
      </div>
    </div>
  );
};

export default UpdateProduct;

/* NewProducts.css */

.new-product-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f4f4f9;
  min-height: 100vh;
}

.new-product-container {
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px 40px;
}

.new-product-container h3 {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.new-product-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-floating {
  position: relative;
}

.form-floating label {
  font-size: 14px;
  color: #777;
}

.form-floating input,
.form-floating select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

span {
  display: flex;
  gap: 10px;
}

.span-21 {
  flex: 1;
}

.span-22 {
  flex: 2;
}

.span-3 {
  flex: 1;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-check input {
  margin: 0;
}

h4 {
  font-size: 18px;
  color: #555;
  margin-bottom: 10px;
}

.btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.btn:hover {
  background-color: #0056b3;
}

.form-select {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

