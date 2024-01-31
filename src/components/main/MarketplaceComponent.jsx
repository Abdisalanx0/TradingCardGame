import React, { useContext } from 'react'
import MarketplaceContext from '../../contexts/MarketplaceContext'
import '../../css/main/MarketplaceComponent.css'

const MarketplaceComponent = () => {
  const { listedCardItems, listedCardItemsSort, setListedCardItemsSort, priceFilter, setPriceFilter, nameFilter, setNameFilter } = useContext(MarketplaceContext)

  let isAtLeastOneCardVisible = false

  const generateListedCardItem = (item) => {
    let isVisible

    switch(priceFilter) {
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

    if(!item.name.toLowerCase().includes(nameFilter.toLowerCase())) {
      isVisible = false
    }

    if(isVisible) {
      isAtLeastOneCardVisible = true
    }

    return (
      isVisible ? 
        <li key={ item.id } id={ `${item.id}-listed-card-item` } className={ `${item.rarity}-item listed-card-item` }>
          <figure className='listed-card-item-figure'>
            <p className='listed-card-item-rarity-p'>{ item.rarity }</p>

            <img className='listed-card-item-thumbnail' src={ item.thumbnail }></img>

            <figcaption className='listed-card-item-name-figcaption'>{ item.name }</figcaption>

            <p className='listed-card-item-description-p' title={ item.description }>{ item.description }</p>

            <p className='listed-card-item-price-p'>${ item.price }</p>
          </figure>
        </li> 
      : null
    )
  }

  const handlePriceFilterOnClick = (e) => {
    if(e.target.id === '0-50-price-filter-radio') {
      setPriceFilter('0-50')
    }
    else if(e.target.id === '50-100-price-filter-radio') {
      setPriceFilter('50-100')
    }
    else if(e.target.id === '100-1000-price-filter-radio') {
      setPriceFilter('100-1000')
    }
    else if(e.target.id === 'all-price-filter-radio') {
      setPriceFilter('')
    }
  }

  const handleNameFilterOnChange = (e) => {
    setNameFilter(e.target.value)
  }

  const handleSortButtonOnClick = (e) => {
    setListedCardItemsSort((oldSort) => {
      const delimiter = oldSort.indexOf(' ')

      let property = oldSort.substring(0, delimiter)
      let orientation = oldSort.substring(delimiter + 1)

      if(e.target.value === 'Name') {
        if(oldSort.includes('name') && orientation === 'asc') {
          orientation = 'des'
        }
        else {
          property = 'name'
          orientation = 'asc'
        }
      }
      else if(e.target.value === 'Price') {
        if(oldSort.includes('price') && orientation === 'asc') {
          orientation = 'des'
        }
        else {
          property = 'price'
          orientation = 'asc'
        }
      }
      else if(e.target.value === 'Rarity') {
        if(oldSort.includes('rarity') && orientation === 'asc') {
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
    <main id='marketplace-main'>
      <form id='marketplace-filter-and-sort-form'>
        <fieldset id='price-filter-fieldset' className='marketplace-filter-and-sort-fieldset'>
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

        <fieldset id='name-filter-fieldset' className='marketplace-filter-and-sort-fieldset'>
          <legend hidden>Name Filter</legend>

          <input id='name-filter-input' placeholder='search by card name' value={ nameFilter } onChange={ handleNameFilterOnChange }></input>
        </fieldset>

        <fieldset id='sort-fieldset' className='marketplace-filter-and-sort-fieldset'>
          <legend>Sort</legend>

          <input type='button' value='Name' onClick={ handleSortButtonOnClick }></input>

          <input type='button' value='Price' onClick={ handleSortButtonOnClick }></input>

          <input type='button' value='Rarity' onClick={ handleSortButtonOnClick }></input>
        </fieldset>
      </form>

      <section id='listed-card-items-section'>
        <h2>Listed Trading Cards</h2>

        <ul id='listed-card-items-ul'>
          { listedCardItems.map((item) => generateListedCardItem(item)) }

          { !isAtLeastOneCardVisible ? <p>No items to show</p> : null }
        </ul>
      </section>
    </main>
  )
}

export default MarketplaceComponent