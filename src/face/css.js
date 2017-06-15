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
        padding: '8px 16px',
        borderStyle: 'none',
        backgroundColor:'#ffdb58',
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
