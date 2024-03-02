import React, { useContext } from 'react';
import MarketplaceContext from '../../context/MarketplaceContext';
import '../../css/main/MarketplaceComponent.css';
import CheckoutContext from '../../context/CheckoutContext';

const MarketplaceComponent = () => {
  // Assuming MarketplaceContext provides functions to set and get listed items among other things
  const { listedItems, setListedItemsSort, listedItemsPriceFilter, setListedItemsPriceFilter, listedItemsNameFilter, setListedItemsNameFilter, listedItemsCurrentPage, setListedItemsCurrentPage } = useContext(MarketplaceContext);
  const { cart, setCart } = useContext(CheckoutContext)

  const handleAddToCartOnClick = (e) => {
    const delimiterIndex = e.target.id.indexOf('-add-to-cart-button')
    const itemId = Number(e.target.id.substring(0, delimiterIndex))

    if(e.target.value === 'Add to Cart') {
      setCart((oldCart) => {
        const newCart = { 
          items: [...oldCart.items], 
          count: oldCart.count,
          totalPrice: oldCart.totalPrice
        }
  
        for(let item of listedItems.items) {
          if(item.id === itemId) {
            newCart.items.push(item)
  
            newCart.count++
            newCart.totalPrice += item.price
  
            break
          }
        }
  
        return newCart
      })
    }
    else if(e.target.value === 'Remove from Cart') {
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
  }

  const generateListedItem = (item) => {
    return (
      <li key={ item.id } id={ `${item.id}-listed-item` } className={ `${item.rarity}-item listed-item` }>
        <figure className='listed-item-figure'>
          <p className='listed-item-rarity-p'>{ item.rarity }</p>

          <img className='listed-item-thumbnail' src={`/graphics/${item.image}`}></img>

          <figcaption className='listed-item-name-figcaption'>{ item.name }</figcaption>

          <p className='listed-item-description-p' title={ item.description }>{ item.description }</p>
        </figure>


        <form className='listed-item-add-to-cart-form'>
          <label className='listed-item-add-to-cart-button-label'>
            <p className='listed-item-price'>${ item.price }</p>
            <input id={ `${item.id}-add-to-cart-button` } className='listed-item-add-to-cart-button' type='button' value={ cart.items.some((cartItem) => cartItem.id === item.id) ? 'Remove from Cart' : 'Add to Cart' } onClick={ handleAddToCartOnClick }></input>
          </label>
        </form>
      </li> 

    )
  }

  const handlePriceFilterOnClick = (e) => {
    if(e.target.id === '0-50-price-filter-radio') {
      setListedItemsPriceFilter('0-50')
    }
    else if(e.target.id === '50-100-price-filter-radio') {
      setListedItemsPriceFilter('50-100')
    }
    else if(e.target.id === '100-1000-price-filter-radio') {
      setListedItemsPriceFilter('100-1000')
    }
    else if(e.target.id === 'all-price-filter-radio') {
      setListedItemsPriceFilter('')
    }
  }

  const handleNameFilterOnChange = (e) => {
    setListedItemsNameFilter(e.target.value)
  }

  const handleNameFilterOnKeyDown = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const handleSortButtonOnClick = (e) => {
    setListedItemsSort((oldSort) => {
      const delimiter = oldSort.indexOf(' ')

      let property = oldSort.substring(0, delimiter)
      let orientation = oldSort.substring(delimiter + 1)

      if(e.target.value === 'Name') {
        if(property === 'name' && orientation === 'asc') {
          orientation = 'des'
        }
        else {
          property = 'name'
          orientation = 'asc'
        }
      }
      else if(e.target.value === 'Price') {
        if(property === 'price' && orientation === 'asc') {
          orientation = 'des'
        }
        else {
          property = 'price'
          orientation = 'asc'
        }
      }
      else if(e.target.value === 'Rarity') {
        if(property === 'rarity' && orientation === 'asc') {
          orientation = 'des'
        }
        else {
          property = 'rarity'
          orientation = 'asc'
        }
      }

      return `${property} ${orientation}`
    })
  }

  const handlePageButtonOnClick = (e) => {
    if(e.target.value === 'Previous' && listedItemsCurrentPage > 1) {
      setListedItemsCurrentPage(listedItemsCurrentPage - 1)
    }
    else if(e.target.value === 'Next' && listedItemsCurrentPage < listedItems.totalPages) {
      setListedItemsCurrentPage(listedItemsCurrentPage + 1)
    }
  }

  return (
    <>
      <form id='mp-filter-and-sort-form'>
        <fieldset id='mp-price-filter-fieldset' className='mp-filter-and-sort-fieldset'>
          <legend>Price Filter</legend>

          <label>
            <input id='0-50-price-filter-radio' type='radio' name='price-filter-radio' onClick={ handlePriceFilterOnClick } defaultChecked={ listedItemsPriceFilter === '0-50' }></input>

            $0-$50
          </label>

          <label>
            <input id='50-100-price-filter-radio' type='radio' name='price-filter-radio' onClick={ handlePriceFilterOnClick } defaultChecked={ listedItemsPriceFilter === '50-100' }></input>

            $50-$100
          </label>

          <label>
            <input id='100-1000-price-filter-radio' type='radio' name='price-filter-radio' onClick={ handlePriceFilterOnClick } defaultChecked={ listedItemsPriceFilter === '100-1000' }></input>

            $100-$1000
          </label>

          <label>
            <input id='all-price-filter-radio' type='radio' name='price-filter-radio' onClick={ handlePriceFilterOnClick } defaultChecked={ listedItemsPriceFilter === '' }></input>

            All Prices
          </label>
        </fieldset>

        <fieldset id='mp-name-filter-fieldset' className='mp-filter-and-sort-fieldset'>
          <legend hidden>Name Filter</legend>

          <input id='mp-name-filter-input' placeholder='search by card name' value={ listedItemsNameFilter } onChange={ handleNameFilterOnChange } onKeyDown={ handleNameFilterOnKeyDown }></input>
        </fieldset>

        <fieldset id='mp-sort-fieldset' className='mp-filter-and-sort-fieldset'>
          <legend>Sort</legend>

          <input type='button' value='Name' onClick={ handleSortButtonOnClick }></input>

          <input type='button' value='Price' onClick={ handleSortButtonOnClick }></input>

          <input type='button' value='Rarity' onClick={ handleSortButtonOnClick }></input>
        </fieldset>

        <fieldset id='mp-page-selection-fieldset'>
          <legend>Page</legend>

          <div className='overlayed-button-container'>
            {/* src: /icons/arrow-back.svg */}
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>

            <input className='pagination-button overlayed-button' type='button' value='Previous' onClick={ handlePageButtonOnClick }></input>
          </div>

          <p>{ listedItemsCurrentPage } of { listedItems.totalPages }</p>

          <div className='overlayed-button-container'>
            {/* src: /icons/arrow-forward.svg */}
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>

            <input className='pagination-button overlayed-button' type='button' value='Next' onClick={ handlePageButtonOnClick }></input>
          </div>
        </fieldset>
      </form>

      <section id='listed-items-section'>
        <h2>Listed Trading Cards</h2>

        <ul id='listed-items-ul'>
          { listedItems.items.map(generateListedItem) }

          { !listedItems.items.length ? <p>No items to show</p> : null }
        </ul>
      </section>
    </>
  )
}

export default MarketplaceComponent