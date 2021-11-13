module.exports = (path) => {
return`
{
  "name": "${process.env.APPNAME}--compiler",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build && next export -o ${path}",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "12.0.3",
    "react": "17.0.2",
    "react-dom": "17.0.2"
  },
  "devDependencies": {
    "eslint": "7.32.0",
    "eslint-config-next": "12.0.3"
  }
}
`
}