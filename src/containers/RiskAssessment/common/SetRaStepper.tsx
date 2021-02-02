import { RA_STEPPER } from "../../../graphql/mutations/RaStepper";

export const setRaStepper = (
  client: any,
  raStep: string | null,
  activeStep: string | null = "success",
  propsData: any
) => {
  client.writeQuery({
    query: RA_STEPPER,
    data: { raStep, activeStep, propsData },
  });
};
