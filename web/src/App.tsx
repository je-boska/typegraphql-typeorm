import './App.css'
import { useBooksQuery } from './generated/graphql'

const App = () => {
  const { data } = useBooksQuery()

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {data.books.map(book => (
        <div key={book.id}>
          <h1>{book.title}</h1>
          <p>{book.author}</p>
          {book.isPublished ? <p>Published</p> : <p>Not Published</p>}
        </div>
      ))}
    </div>
  )
}

export default App
