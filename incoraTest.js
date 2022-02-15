const productList = []

class User {
  constructor(name, balance) {
    if (balance < 0) {
      throw new Error('Balance must be positive.')
    }

    this.name = name
    this.balance = balance
    this.orders = []
  }

  showOrderHistory(field, reverse = false) {
    const result = this.orders.sort(
      (item1, item2) => item1[field] - item2[field]
    )
    if (reverse) {
      result.reverse()
    }

    let showOrdersInfo = ''

    for (let i = 0; i < result.length; i++) {
      showOrdersInfo += `Total price: ${result[i].totalPrice}, date: ${result[i].date}\n`
    }

    return showOrdersInfo
  }

  getCart(user) {
    return new Cart(user)
  }

  addOrder(products, totalPrice, date) {
    const order = new Order(products, totalPrice, date)
    this.orders.push(order)
  }
}

class Admin extends User {
  createProduct(name, price, amount) {
    const product = new Product(name, price, amount)
    productList.push(product)
  }
}

class Product {
  constructor(name, price, quantity) {
    if (quantity < 0) {
      throw new Error('Quantity must be positive.')
    }

    this.name = name
    this.price = price
    this.quantity = quantity
  }

  substractAmount(amount) {
    return this.quantity - amount
  }
}

class Cart {
  constructor(user) {
    this.products = []
    this.user = user
  }

  addProduct(product) {
    this.products.push(product)
  }

  removeProduct(productName) {
    for (let i = 0; i < this.products.length; i++) {
      const current = this.products[i]
      if (current.name === productName) {
        this.products.splice(i, 1)
      }
    }
  }

  withdraw() {
    this.products.length = 0
  }

  checkout() {
    const totalPrice = this.products.reduce((a, b) => a + (b.price || 0), 0)
    const date = new Date().toLocaleDateString()
    const countProducts = new Map()

    if (this.user.balance - totalPrice < 0) {
      throw new Error('There are not enough funds on the balance.')
    }
    this.user.balance -= totalPrice

    for (let product of this.products) {
      countProducts.set(
        product,
        countProducts.has(product) ? countProducts.get(product) + 1 : 1
      )
    }

    for (let product of productList) {
      if (countProducts.has(product)) {
        if (countProducts.get(product) > product.quantity) {
          throw new Error(`Not enough ${product.name}`)
        }
        product.quantity -= countProducts.get(product)
      }
    }

    this.user.addOrder(this.products, totalPrice, date)
  }
}

class Order {
  constructor(products, totalPrice, date) {
    this.products = products
    this.totalPrice = totalPrice
    this.date = date
  }
}

const createProducts = () => {
  const admin = new Admin('Yurii', 40)

  admin.createProduct('shirt', 10, 100)
  admin.createProduct('hat', 20, 100)
  admin.createProduct('shoe', 15, 100)
  admin.createProduct('coat', 5, 100)
  admin.createProduct('jacket', 55, 100)
  admin.createProduct('skirt', 35, 100)
  // admin.createProduct('sandals', 20, -10) // throw new Error('Quantity must be positive.')
}

const main = () => {
  createProducts()

  const user = new User('Yaroslav', 3000)

  // const user2 = new User('Error', -1000) // throw new Error('Balance must be positive.')

  // Create shoping carts
  const userCart = user.getCart(user)
  const userCart2 = user.getCart(user)

  // First shoping cart
  userCart.addProduct(productList[0])
  userCart.addProduct(productList[1])
  userCart.addProduct(productList[1])
  userCart.addProduct(productList[1])
  userCart.addProduct(productList[1])
  userCart.addProduct(productList[4])
  userCart.addProduct(productList[2])
  userCart.addProduct(productList[3])

  // Second shoping cart
  userCart2.addProduct(productList[0])
  userCart2.addProduct(productList[1])
  userCart2.addProduct(productList[1])
  userCart2.addProduct(productList[1])
  userCart2.addProduct(productList[1])
  userCart2.addProduct(productList[4])
  userCart2.addProduct(productList[4])
  userCart2.addProduct(productList[1])

  // Create orders
  userCart.checkout()
  userCart2.checkout()

  // Show orders
  console.log('Show orders:')
  console.log(user.showOrderHistory('price', (reverse = true)))
  console.log('User balance: ', user.balance)
}

main()
