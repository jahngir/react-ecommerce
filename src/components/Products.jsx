import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const controller = new AbortController();

    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products/", {
          signal: controller.signal,
        });
        const products = await response.json();
        const enrichedProducts = products.map((product) => ({
          ...product,
          stock: Math.random() > 0.3 ? Math.floor(Math.random() * 10 + 1) : 0,
          variants: ["Small", "Medium", "Large", "XL"],
        }));
        setData(enrichedProducts);
        setFilter(enrichedProducts);
        setLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch failed:", err);
          setLoading(false);
        }
      }
    };

    getProducts();

    return () => {
      controller.abort();
    };
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        {[...Array(6)].map((_, index) => (
          <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4" key={index}>
            <Skeleton height={592} />
          </div>
        ))}
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {filter.map((product) => (
          <div
            id={product.id}
            key={product.id}
            className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
          >
            <div className="card h-100 shadow-sm text-center">
              <img
                className="card-img-top p-3"
                src={product.image}
                alt={product.title}
                height={300}
                style={{ objectFit: "contain" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate">{product.title}</h5>
                <p className="card-text small">
                  {product.description.substring(0, 90)}...
                </p>
                <p className="lead fw-bold">$ {product.price}</p>

                <select className="form-select mb-3">
                  {product.variants.map((variant, index) => (
                    <option key={index}>{variant}</option>
                  ))}
                </select>

                {product.stock > 0 ? (
                  <button
                    className="btn btn-dark w-100 mt-auto"
                    onClick={() => {
                      toast.success("Added to cart");
                      addProduct(product);
                    }}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button className="btn btn-secondary w-100 mt-auto" disabled>
                    Out of Stock
                  </button>
                )}
              </div>
              <div className="card-footer bg-white">
                <Link
                  to={`/product/${product.id}`}
                  className="btn btn-outline-dark btn-sm"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center">Latest Products</h2>
          <hr />
        </div>
      </div>
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};

export default Products;
