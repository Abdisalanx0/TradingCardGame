import React, { useContext } from 'react'
import MarketplaceContext from '../../context/MarketplaceContext'
import '../../css/main/MarketplaceComponent.css'

const MarketplaceComponent = () => {
  const { listedItems, setListedItemsSort, listedItemPriceFilter, setListedItemPriceFilter, listedItemNameFilter, setListedItemNameFilter } = useContext(MarketplaceContext)

  let isAtLeastOneCardVisible = false

  const handlePurchaseOnClick = (e) => {

  }

  const generateListedItem = (item) => {
    let isVisible

    switch(listedItemPriceFilter) {
      case '':
        isVisible = true

        break
      case '0-50':
        isVisible = item.price <= 50

        break
      case '50-100':
        isVisible = item.price >= 50 && item.price <= 100

        break
      case '100-1000':
        isVisible = item.price >= 100 && item.price <= 1000
    }

    if(!item.name.toLowerCase().includes(listedItemNameFilter.toLowerCase())) {
      isVisible = false
    }

    if(isVisible) {
      isAtLeastOneCardVisible = true
    }

    return (
      isVisible ? 
        <li key={ item.id } id={ `${item.id}-listed-item` } className={ `${item.rarity}-item listed-item` }>
          <figure className='listed-item-figure'>
            <p className='listed-item-rarity-p'>{ item.rarity }</p>

            <img className='listed-item-thumbnail' src={ item.thumbnail }></img>

            <figcaption className='listed-item-name-figcaption'>{ item.name }</figcaption>

            <p className='listed-item-description-p' title={ item.description }>{ item.description }</p>
          </figure>

          <form className='listed-item-purchase-form'>
            <label className='listed-item-purchase-button-label'>
              <input id={ `${item.id}-purchase-button` } className='listed-item-purchase-button' type='button' value='Purchase' onClick={ handlePurchaseOnClick }></input>

              ${ item.price }
            </label>
          </form>
        </li> 
      : null
    )
  }

  const handlePriceFilterOnClick = (e) => {
    if(e.target.id === '0-50-price-filter-radio') {
      setListedItemPriceFilter('0-50')
    }
    else if(e.target.id === '50-100-price-filter-radio') {
      setListedItemPriceFilter('50-100')
    }
    else if(e.target.id === '100-1000-price-filter-radio') {
      setListedItemPriceFilter('100-1000')
    }
    else if(e.target.id === 'all-price-filter-radio') {
      setListedItemPriceFilter('')
    }
  }

  const handleNameFilterOnChange = (e) => {
    setListedItemNameFilter(e.target.value)
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

  return (
    <>
      <form id='mp-filter-and-sort-form'>
        <fieldset id='mp-price-filter-fieldset' className='mp-filter-and-sort-fieldset'>
          <legend>Price Filter</legend>

          <label>
            <input id='0-50-price-filter-radio' type='radio' name='price-filter-radio' onClick={ handlePriceFilterOnClick }></input>

            $0-$50
          </label>

          <label>
            <input id='50-100-price-filter-radio' type='radio' name='price-filter-radio' onClick={ handlePriceFilterOnClick }></input>

            $50-$100
          </label>

          <label>
            <input id='100-1000-price-filter-radio' type='radio' name='price-filter-radio' onClick={ handlePriceFilterOnClick }></input>

            $100-$1000
          </label>

          <label>
            <input id='all-price-filter-radio' type='radio' name='price-filter-radio' onClick={ handlePriceFilterOnClick } defaultChecked={ true }></input>

            All Prices
          </label>
        </fieldset>

        <fieldset id='mp-name-filter-fieldset' className='mp-filter-and-sort-fieldset'>
          <legend hidden>Name Filter</legend>

          <input id='mp-name-filter-input' placeholder='search by card name' value={ listedItemNameFilter } onChange={ handleNameFilterOnChange }></input>
        </fieldset>

        <fieldset id='mp-sort-fieldset' className='mp-filter-and-sort-fieldset'>
          <legend>Sort</legend>

          <input type='button' value='Name' onClick={ handleSortButtonOnClick }></input>

          <input type='button' value='Price' onClick={ handleSortButtonOnClick }></input>

          <input type='button' value='Rarity' onClick={ handleSortButtonOnClick }></input>
        </fieldset>
      </form>

      <section id='listed-items-section'>
        <h2>Listed Trading Cards</h2>

        <ul id='listed-items-ul'>
          { listedItems.map(generateListedItem) }

          { !isAtLeastOneCardVisible ? <p>No items to show</p> : null }
        </ul>
      </section>
    </>
  )
}

export default MarketplaceComponent