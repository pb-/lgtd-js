export function generateItemId () {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''

  for (let i = 0; i < 3; i++) {
    id += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }

  return id
}
