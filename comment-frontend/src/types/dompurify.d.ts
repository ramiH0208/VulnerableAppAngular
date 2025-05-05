declare module 'dompurify' {
    interface DOMPurifyInstance {
      sanitize: (dirty: string, config?: object) => string;
    }
  
    const DOMPurify: DOMPurifyInstance;
    export default DOMPurify;
  }

  