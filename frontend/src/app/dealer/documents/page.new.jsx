// ... existing imports and component definition ...

      if (verifiedCount === 4) {
        try {
          const dealer = JSON.parse(localStorage.getItem('dealer'));
          const ownerId = typeof car.owner === 'object' ? car.owner._id : car.owner;
          
          // First check if pickup exists for this car
          try {
            const existingPickupResponse = await axios.get(
              `http://localhost:8000/pickup/car/${car._id}`,
              {
                headers: { Authorization: `Bearer ${dealerToken}` }
              }
            );

            if (existingPickupResponse.data) {
              // Pickup exists, show success message
              toast.success('All documents verified. Pickup is ready to be scheduled.');
            } else {
              // Create new pickup if none exists
              const pickupPayload = {
                carId: car._id,
                userId: ownerId,
                dealerId: dealer._id,
                status: 'pending'
              };
              await axios.post(`http://localhost:8000/pickup/create`, pickupPayload, {
                headers: { 
                  'Authorization': `Bearer ${dealerToken}`,
                  'Content-Type': 'application/json'
                }
              });
              toast.success('Documents verified and pickup created successfully!');
            }
          } catch (pickupErr) {
            if (pickupErr.response?.data?.message?.includes('already exists')) {
              // If pickup already exists, show success message
              toast.success('Documents verified. Pickup is ready to be scheduled.');
            } else {
              throw pickupErr; // Re-throw if it's a different error
            }
          }
        } catch (err) {
          console.error('Failed to create pickup:', err, err?.response?.data);
          if (err.response?.status === 401) {
            toast.error('Your session has expired. Please login again.');
            window.location.href = '/dealer_login';
            return;
          } else if (err.response?.data?.message) {
            toast.error('Failed to create pickup: ' + err.response.data.message);
          } else {
            toast.error('Failed to create pickup. Please try again.');
          }
        }
      }
