import Swal from 'sweetalert2';

interface SerializerError {
  [key: string]: string[] | SerializerError[];
}

const flattenErrors = (errors: SerializerError): string =>
  Object.entries(errors)
    .flatMap(([key, value]) => {
      return value.map((v) => {
        if (typeof v === 'object') {
          return `${key}: ${flattenErrors(v)}`;
        } else {
          return `${key}: ${v}`;
        }
      });
    })
    .join(',\n');

export function getErrorMessage(e: any): string {
  if (!e) return 'An unexpected error occurred';
  if (typeof e === 'string') return e;
  
  const errObj = e.error || e;

  if (errObj.serializer_errors) {
    return flattenErrors(errObj.serializer_errors);
  }

  // Handle direct string error format: {"error": "message"}
  if (typeof errObj === 'string') {
    return errObj;
  }

  if (typeof errObj === 'object') {
    if (errObj.message) return errObj.message;
    if (errObj.error) return typeof errObj.error === 'string' ? errObj.error : flattenErrors(errObj.error);
    if (errObj.errors) return typeof errObj.errors === 'string' ? errObj.errors : flattenErrors(errObj.errors);
    if (errObj.detail) return errObj.detail;
    
    // Flatten any key-value pairs (like standard DRF serializer field errors)
    try {
      const fieldErrors = Object.entries(errObj)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : (typeof v === 'object' ? JSON.stringify(v) : v)}`)
        .join('\n');
      if (fieldErrors) return fieldErrors;
    } catch (_) {}
  }

  return e.message || 'An unexpected error occurred';
}

export function handleAPIException(e: any, fallback?: string) {
  const errorMessage = (e as string) || fallback || 'An unexpected error occured';
  
  if (errorMessage.includes('Nomination requires 50,000+ followers')) {
    Swal.fire({
      title: 'Waitlisted',
      text: 'Your profile is currently waitlisted. You will be able to submit your nomination once it has been cleared.',
      icon: 'info',
      confirmButtonText: 'OK',
    });
  } else {
    Swal.fire(
      'Error',
      errorMessage,
      'error'
    );
  }
}
