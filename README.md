# Basic Ray Tracer 2

After some reading in early autumn 2019, I revisited my Basic Ray Tracer and ended up completely rewriting it. It incorporates a new algorithm for rapidly zeroing in on the edge of an object – approximately halving the edge position uncertainty during each iteration. And additionally includes a new GUI feature consisting of a selectable birds-eye view of the scene prior to rendering. This enables the user to decide exactly where to place the camera, including its angle of horizontal rotation, so that their eventual scene render will be completely customised.

There remain some display issues to solve, such as black lines that can appear on the rendered image, which I am considering solving temporarily by writing a clean up function that will fill these artificially.

Additionally, whilst I intend to incorporate directional light sources, currently the project only makes use of ambient light. This means that the scene renders are quite dark, requiring that the GUI camera be placed very near the scene objects in order to clearly view them in these low light conditions once rendered. I also intend to add the ability for light to be reflected off the 3D spheres, and am currently working on the associated maths and how best to implement this.
