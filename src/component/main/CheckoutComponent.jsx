import React, { useContext } from 'react'
import CheckoutContext from '../../context/CheckoutContext'
import '../../css/main/CheckoutComponent.css'

const CheckoutComponent = () => {
  const { cart, setCart } = useContext(CheckoutContext)

  const handleRemoveFromCartOnClick = (e) => {
    const delimiterIndex = e.target.id.indexOf('-remove-from-cart-button')
    const itemId = e.target.id.substring(0, delimiterIndex)

    setCart((oldCart) => {
      const newCart = { 
        items: [], 
        count: oldCart.count,
        totalPrice: oldCart.totalPrice
      }

      for(let i = 0; i < oldCart.items.length; i++) {
        if(oldCart.items[i].id === itemId) {
          newCart.count--
          newCart.totalPrice -= oldCart.items[i].price
        }
        else {
          newCart.items.push(oldCart.items[i])
        }
      }

      return newCart
    })
  }

  const generateCartItem = (item) => {
    return (
      <li key={ item.id } id={ `${item.id}-cart-item` } className={ `${item.rarity}-item cart-item` }>
        <figure className='cart-item-figure'>
          <p className='cart-item-rarity-p'>{ item.rarity }</p>

          <img className='cart-item-thumbnail' src={`/public/graphics/${item.image}`}></img>

          <figcaption className='cart-item-name-figcaption'>{ item.name }</figcaption>

          <p className='cart-item-description-p' title={ item.description }>{ item.description }</p>
        </figure>

        <form className='cart-item-remove-from-cart-form'>
          <label className='cart-item-remove-from-cart-button-label'>
            <input id={ `${item.id}-remove-from-cart-button` } className='cart-item-remove-from-cart-button' type='button' value='Remove from Cart' onClick={ handleRemoveFromCartOnClick }></input>
          </label>
        </form>
      </li> 
    )
  }

  return (
    <>
      <form id='checkout-form'>
        { 
          cart.count ? 
            <fieldset id='checkout-fieldset'>
              <legend hidden>Checkout Confirmation</legend>

              <p>Cart Total: ${ cart.totalPrice }</p>

              <input id='checkout-button' type='button' value='Checkout'></input>
            </fieldset>
          :
            null
        }
      </form>

      <section id='cart-items-section'>
        <h2>Checkout</h2>

        <ul id='cart-items-ul'>
          { cart.items.map(generateCartItem) }

          { !cart.count ? <p>No items to show</p> : null }
        </ul>
      </section>
    </>
  )
}

export default CheckoutComponent