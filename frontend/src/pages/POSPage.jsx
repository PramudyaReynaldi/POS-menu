import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { ComponentToPrint } from "../components/ComponentToPrint";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchProducts = async () => {
    const result = await axios.get("http://localhost:5000/products");
    setProducts(result.data);
    setIsLoading(false);
  };

  const addProductToCart = async (product) => {
    let findProductToCart = cart.find((i) => {
      return i.id === product.id;
    });

    if (findProductToCart) {
      let newCart = [];
      let newItem;

      cart.forEach((cartItem) => {
        if (cartItem.id === product.id) {
          newItem = {
            ...cartItem,
            quantity: cartItem.quantity + 1,
            totalAmount: cartItem.price * (cartItem.quantity + 1),
          };
          newCart.push(newItem);
        } else {
          newCart.push(cartItem);
        }

        setCart(newCart);
        toast(`Added ${newItem.name} to cart`);
      });
    } else {
      let addingProduct = {
        ...product,
        quantity: 1,
        totalAmount: product.price,
      };
      setCart([...cart, addingProduct]);
      toast(`Added ${product.name} to cart`);
    }
  };

  const removeProduct = async (product) => {
    const newCart = await cart.filter((cartItem) => cartItem.id !== product.id);
    setCart(newCart);
  };

  const componentRef = useRef();

  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handleReactToPrint;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let newTotalAmount = 0;
    cart.forEach((i) => {
      newTotalAmount += parseInt(i.totalAmount);
    });
    setTotalAmount(newTotalAmount);
  }, [cart]);

  return (
    <>
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5">
            {isLoading ? (
              "Loading..."
            ) : (
              <div className="row">
                {products.map((product) => (
                  <div className="col-lg-4 mb-4">
                    <div key={products.id} className="col-lg-5">
                      <div
                        className="card"
                        style={{
                          height: "200px",
                          width: "170px",
                          cursor: "pointer",
                        }}
                        onClick={() => addProductToCart(product)}
                      >
                        <div className="post-item text-center">
                          <img
                            src={product.image}
                            className="img-fluid"
                            alt={product.name}
                          />
                          <p className="fw-bold">{product.name}</p>
                          <p>Rp. {product.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <section className="col-lg-4">
            <div style={{ display: "none" }}>
              <ComponentToPrint
                cart={cart}
                totalAmount={totalAmount}
                ref={componentRef}
              />
            </div>
            <table className="table bg-light">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Total</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart
                  ? cart.map((cartProduct) => (
                      <tr key={products.id}>
                        <td>{cartProduct.name}</td>
                        <td>{cartProduct.price}</td>
                        <td>{cartProduct.quantity}</td>
                        <td>{cartProduct.totalAmount}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => removeProduct(cartProduct)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  : "No cart found"}
              </tbody>
            </table>
            <div className="mt-3">
              {totalAmount !== 0 ? (
                <div>
                  <button className="btn btn-primary" onClick={handlePrint}>
                    Pay Now
                  </button>
                </div>
              ) : (
                "Please add a product to the cart"
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
