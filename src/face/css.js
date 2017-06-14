export const styleOn = (windowWidth) =>  {
  //if( windowWidth < 480 ){
  //if( windowWidth < 720 ){
    return {
      wall: {
        backgroundColor: '#fffff9',
        color: 'rgba(0, 0, 0, 0.87)',
      },
      button: {
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '10px 30px',
        borderStyle: 'none',
        backgroundColor:'#248',
        color: '#fff',
      },
      textarea: {
        fontSize: '18px',
        width: '100%',
        height: '30%',
        border: 'none',
      },
    }
}
