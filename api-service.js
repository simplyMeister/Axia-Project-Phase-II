class APIService {
  constructor() {
    this.baseURLs = {
      reqres: "https://reqres.in/api",
      fakestore: "https://fakestoreapi.com",
      jsonplaceholder: "https://jsonplaceholder.typicode.com",
      randomuser: "https://randomuser.me/api",
      openlibrary: "https://openlibrary.org",
    }
    this.authToken = localStorage.getItem("authToken")
  }

  // Generic fetch method with error handling
  async fetchData(url, options = {}) {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      }

      // Add ReqRes API key for ReqRes endpoints
      if (url.includes("reqres.in")) {
        headers["x-api-key"] = "reqres-free-v1"
      }

      const response = await fetch(url, {
        headers,
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Authentication APIs (ReqRes)
  async login(email, password) {
    try {
      console.log("[v0] Making login request to ReqRes API")
      const response = await this.fetchData(`${this.baseURLs.reqres}/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      if (!response.token) {
        throw new Error("Login failed: No token received")
      }

      return response
    } catch (error) {
      console.error("[v0] Login API error:", error)
      throw error
    }
  }

  async register(email, password) {
    try {
      return await this.fetchData(`${this.baseURLs.reqres}/register`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
    } catch (error) {
      console.error("[v0] Register API error:", error)
      throw error
    }
  }

  async getUsers(page = 1) {
    return this.fetchData(`${this.baseURLs.reqres}/users?page=${page}`)
  }

  // Courses APIs (Fake Store and Open Library)
  async getCoursesFromLibrary(subject = "javascript", limit = 20) {
    const data = await this.fetchData(`${this.baseURLs.openlibrary}/search.json?q=subject:${subject}&limit=${limit}`)
    return this.processLibraryData(data.docs || [])
  }

  async searchLibraryCourses(query, limit = 20) {
    const data = await this.fetchData(
      `${this.baseURLs.openlibrary}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`,
    )
    return this.processLibraryData(data.docs || [])
  }

  async getCourses(limit = 20, useLibrary = false, subject = "javascript") {
    if (useLibrary) {
      return this.getCoursesFromLibrary(subject, limit)
    } else {
      const products = await this.fetchData(`${this.baseURLs.fakestore}/products?limit=${limit}`)
      return this.processCourseData(products)
    }
  }

  async getCoursesByCategory(category) {
    return this.fetchData(`${this.baseURLs.fakestore}/products/category/${category}`)
  }

  async getCategories() {
    return this.fetchData(`${this.baseURLs.fakestore}/products/categories`)
  }

  async getCourse(id) {
    return this.fetchData(`${this.baseURLs.fakestore}/products/${id}`)
  }

  // Assignments APIs (JSONPlaceholder)
  async getAssignments(userId = null) {
    const url = userId
      ? `${this.baseURLs.jsonplaceholder}/users/${userId}/todos`
      : `${this.baseURLs.jsonplaceholder}/todos`
    return this.fetchData(url)
  }

  async updateAssignment(id, completed) {
    return this.fetchData(`${this.baseURLs.jsonplaceholder}/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    })
  }

  async createAssignment(title, userId = 1) {
    return this.fetchData(`${this.baseURLs.jsonplaceholder}/todos`, {
      method: "POST",
      body: JSON.stringify({
        title,
        completed: false,
        userId,
      }),
    })
  }

  // Profile APIs (Random User)
  async getRandomUser() {
    return this.fetchData(`${this.baseURLs.randomuser}?inc=name,email,picture,location,phone,dob,login`)
  }

  async getMultipleUsers(count = 10) {
    return this.fetchData(`${this.baseURLs.randomuser}?results=${count}&inc=name,email,picture,location,phone`)
  }

  // Utility methods
  setAuthToken(token) {
    this.authToken = token
    localStorage.setItem("authToken", token)
  }

  clearAuthToken() {
    this.authToken = null
    localStorage.removeItem("authToken")
  }

  isAuthenticated() {
    return !!this.authToken
  }

  // Enhanced data processing methods
  processCourseData(products) {
    return products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
      instructor: this.generateInstructor(),
      duration: this.generateDuration(),
      level: this.generateLevel(),
      enrolled: Math.floor(Math.random() * 1000) + 100,
    }))
  }

  processAssignmentData(todos) {
    return todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      userId: todo.userId,
      dueDate: this.generateDueDate(),
      priority: this.generatePriority(),
      course: this.generateCourseName(),
      type: this.generateAssignmentType(),
      points: Math.floor(Math.random() * 50) + 10,
    }))
  }

  // Helper methods for generating additional data
  generateInstructor() {
    const instructors = ["Dr. Smith", "Prof. Johnson", "Ms. Davis", "Mr. Wilson", "Dr. Brown"]
    return instructors[Math.floor(Math.random() * instructors.length)]
  }

  generateDuration() {
    const durations = ["2 hours", "4 hours", "6 hours", "8 hours", "12 hours"]
    return durations[Math.floor(Math.random() * durations.length)]
  }

  generateLevel() {
    const levels = ["Beginner", "Intermediate", "Advanced"]
    return levels[Math.floor(Math.random() * levels.length)]
  }

  generateDueDate() {
    const now = new Date()
    const futureDate = new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
    return futureDate.toISOString().split("T")[0]
  }

  generatePriority() {
    const priorities = ["Low", "Medium", "High"]
    return priorities[Math.floor(Math.random() * priorities.length)]
  }

  generateCourseName() {
    const courses = ["Web Development", "Data Science", "Mobile Development", "UI/UX Design", "Machine Learning"]
    return courses[Math.floor(Math.random() * courses.length)]
  }

  generateAssignmentType() {
    const types = ["Quiz", "Project", "Essay", "Lab", "Presentation"]
    return types[Math.floor(Math.random() * types.length)]
  }

  processLibraryData(books) {
    return books.map((book, index) => ({
      id: book.key ? book.key.replace("/works/", "") : `lib-${index}`,
      title: book.title || "Untitled Course",
      description: book.first_sentence
        ? book.first_sentence.join(" ")
        : "Learn about " + (book.subject ? book.subject.slice(0, 3).join(", ") : "various topics"),
      price: Math.floor(Math.random() * 100) + 29, // Generate random price
      image: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "/abstract-book-cover.png",
      category: book.subject ? book.subject[0] : "General",
      rating: {
        rate: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
        count: Math.floor(Math.random() * 500) + 50,
      },
      instructor: book.author_name ? book.author_name[0] : this.generateInstructor(),
      duration: this.generateDuration(),
      level: this.generateLevel(),
      enrolled: Math.floor(Math.random() * 1000) + 100,
      publishYear: book.first_publish_year || "Unknown",
      source: "openlibrary",
    }))
  }
}

// Create global instance
window.apiService = new APIService()
