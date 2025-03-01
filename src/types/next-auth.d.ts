import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
<<<<<<< HEAD
    avatar: string
    remember?: boolean
  }
  
  interface Session {
    user: User & {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
=======
    remember?: boolean
  }
>>>>>>> 5ac3dd75388b9dd53e3ba9e4706df808b9ba1ca5
} 