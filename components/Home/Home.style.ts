import styled from "styled-components";

const primary = "#efb6b2";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;

  .left {
    flex: 1;
    background-color: #232225;
  }
  .right {
    flex: 1;
    text-align: center;

    main {
      form {
        margin: 30px auto 10px;
        text-align: center;
        
        label {
          display: block;
          width: 30px;
          height: 30px;
          border: 1px solid ${primary};
          border-radius: 50%;
          margin: 10px auto;
          line-height: 30px;
          color: ${primary};
          font-size: 24px;


          input {
            height: 0;
            width: 0;
            opacity: 0;
          }

          &:hover {
            background: pink;
            cursor: pointer;
            color: white;
          }
        }
      }
    }
  }
`;
