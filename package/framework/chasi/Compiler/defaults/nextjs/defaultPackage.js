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
    "@fortawesome/fontawesome-svg-core": "^1.2.36",
    "@fortawesome/free-brands-svg-icons": "^5.15.4",
    "@fortawesome/free-solid-svg-icons": "^5.15.4",
    "@fortawesome/react-fontawesome": "^0.1.16",
    "next": "12.1.5",
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